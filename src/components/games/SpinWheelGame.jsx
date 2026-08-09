import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { soundFx } from '../../soundEngine';

export default function SpinWheelGame({ student, onUpdateStudent, onBack }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [coinsWon, setCoinsWon] = useState(0);

  const sectors = [
    { label: '+30 XU', color: '#FACC15', coins: 30 },
    { label: '+50 XP', color: '#38BDF8', coins: 15 },
    { label: '+20 XU', color: '#4ADE80', coins: 20 },
    { label: 'MAY MẮN', color: '#C084FC', coins: 40 },
    { label: '+10 XU', color: '#FB923C', coins: 10 },
    { label: '+100 XU', color: '#F472B6', coins: 100 },
    { label: '+25 XU', color: '#A3E635', coins: 25 },
    { label: '+50 XU', color: '#E879F9', coins: 50 },
  ];

  useEffect(() => {
    drawWheel(0);
  }, []);

  const drawWheel = (angleOffset = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;
    const numSectors = sectors.length;
    const sectorAngle = (2 * Math.PI) / numSectors;

    ctx.clearRect(0, 0, width, height);

    // Vẽ từng miếng bánh vòng quay
    sectors.forEach((sec, i) => {
      const startAngle = i * sectorAngle + angleOffset;
      const endAngle = startAngle + sectorAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sec.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Text chữ ở mỗi sector
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1E293B';
      ctx.font = '900 18px Fredoka, sans-serif';
      ctx.fillText(sec.label, radius - 20, 6);
      ctx.restore();
    });

    // Vẽ tâm vòng quay
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38BDF8';
    ctx.stroke();

    ctx.fillStyle = '#0284C7';
    ctx.font = '900 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUAY', centerX, centerY + 5);
  };

  const handleSpin = () => {
    if (spinning) return;
    soundFx.playClick();
    setSpinning(true);
    setWinner(null);

    let currentAngle = 0;
    const spinDuration = 4000; // 4 giây
    const randomRotations = 5 + Math.random() * 5;
    const totalRotation = randomRotations * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngle = totalRotation * easeOut;

      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Kết thúc quay
        setSpinning(false);
        const finalAngle = currentAngle % (2 * Math.PI);
        const sectorAngle = (2 * Math.PI) / sectors.length;
        // Mũi tên chỉ ở góc -Math.PI / 2 (Phía trên)
        const winningIndex = Math.floor(
          (2 * Math.PI - (finalAngle % (2 * Math.PI)) + Math.PI / 2) % (2 * Math.PI) / sectorAngle
        );
        const selected = sectors[winningIndex % sectors.length];
        
        soundFx.playFanfare();
        setWinner(selected);
        setCoinsWon(selected.coins);

        // Cộng xu cho học sinh
        onUpdateStudent({
          ...student,
          coins: student.coins + selected.coins
        });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6 animate-pop-in">
      
      {/* HEADER GAME */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { soundFx.playClick(); onBack(); }}
          className="btn-3d btn-3d-blue px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>QUAY LẠI CHỌN GAME</span>
        </button>

        <div className="flex items-center gap-2 bg-yellow-400 text-yellow-950 font-black px-4 py-2 rounded-2xl border-2 border-yellow-300">
          <span>Xu Hiện Có:</span>
          <span>{student.coins} 🪙</span>
        </div>
      </div>

      {/* CONTAINER VÒNG QUAY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-yellow-200 shadow-xl text-center space-y-6">
        <div>
          <span className="inline-block bg-yellow-100 text-yellow-800 font-extrabold text-xs px-3 py-1 rounded-full mb-2">
            🎡 GAME CANVAS INTERACTIVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Vòng Quay Thử Vận May Lớp 4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
            Ấn nút "QUAY NGAY" để thử vận may nhận phần thưởng Xu hấp dẫn!
          </p>
        </div>

        {/* THIẾT KẾ VÒNG QUAY + MŨI TÊN */}
        <div className="relative inline-block mx-auto">
          {/* Mũi tên chỉ vị trí trúng thưởng */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-4xl transform rotate-180 drop-shadow-md">
            🔻
          </div>

          {/* Canvas Vòng Quay */}
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] mx-auto rounded-full shadow-2xl border-8 border-yellow-400"
          ></canvas>
        </div>

        {/* RESULT ANNOUNCEMENT */}
        {winner && (
          <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border-4 border-yellow-400 p-6 rounded-3xl animate-bounce space-y-2">
            <h3 className="text-2xl font-black text-amber-950">
              🎉 CHÚC MỪNG EM TRÚNG: {winner.label}!
            </h3>
            <p className="text-sm font-extrabold text-amber-800">
              Em vừa nhận thêm <span className="text-xl text-amber-900">+{coinsWon} Xu 🪙</span> vào kho báu!
            </p>
          </div>
        )}

        {/* ACTION BUTTON */}
        <div>
          <button
            disabled={spinning}
            onClick={handleSpin}
            className={`btn-3d px-8 py-4 rounded-2xl text-lg font-black tracking-wider shadow-lg ${
              spinning ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'btn-3d-yellow'
            }`}
          >
            {spinning ? 'ĐANG QUAY TIẾP...' : '🎡 QUAY NGAY HÔM NAY!'}
          </button>
        </div>

      </div>

    </div>
  );
}
