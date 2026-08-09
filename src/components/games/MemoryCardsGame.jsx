import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { soundFx } from '../../soundEngine';

export default function MemoryCardsGame({ student, onUpdateStudent, onBack }) {
  const cardData = [
    { id: 1, text: '25 × 4', pairId: 'pair-1' },
    { id: 2, text: '100', pairId: 'pair-1' },
    { id: 3, text: 'Cần cù', pairId: 'pair-2' },
    { id: 4, text: 'Chăm chỉ', pairId: 'pair-2' },
    { id: 5, text: 'Nước đá', pairId: 'pair-3' },
    { id: 6, text: 'Thể Rắn', pairId: 'pair-3' },
    { id: 7, text: 'Hanoi', pairId: 'pair-4' },
    { id: 8, text: 'Thủ đô VN', pairId: 'pair-4' },
  ];

  const [cards, setCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // Trộn bài ngẫu nhiên (Fisher-Yates Shuffle)
    const shuffled = [...cardData].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndex([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
  };

  const handleCardClick = (index) => {
    if (flippedIndex.length === 2 || flippedIndex.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return;
    }

    soundFx.playClick();
    const newFlipped = [...flippedIndex, index];
    setFlippedIndex(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // Khớp cặp!
        soundFx.playCoin();
        setMatchedPairs(prev => [...prev, card1.pairId]);
        setFlippedIndex([]);

        // Kiểm tra xem đã thắng chưa
        if (matchedPairs.length + 1 === cardData.length / 2) {
          soundFx.playFanfare();
          setGameCompleted(true);
          onUpdateStudent({
            ...student,
            coins: student.coins + 40,
            xp: student.xp + 60
          });
        }
      } else {
        // Không khớp -> Lật lại sau 1s
        setTimeout(() => {
          setFlippedIndex([]);
        }, 1000);
      }
    }
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

        <div className="flex items-center gap-4">
          <span className="font-extrabold text-slate-700 text-sm">Số lần lật: {moves}</span>
          <button
            onClick={() => { soundFx.playClick(); initGame(); }}
            className="btn-3d btn-3d-yellow px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
          >
            <RefreshCw size={16} />
            <span>CHƠI LẠI</span>
          </button>
        </div>
      </div>

      {/* CONTAINER BẢNG LẬT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-200 shadow-xl space-y-6 text-center">
        <div>
          <span className="inline-block bg-purple-100 text-purple-800 font-extrabold text-xs px-3 py-1 rounded-full mb-2">
            🃏 GAME TRÍ NHỚ & GHÉP CẶP LỚP 4
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Bảng Lật Trí Nhớ Kỳ Diệu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
            Lật và ghép 2 thẻ có kết quả hoặc ý nghĩa tương đương với nhau nhé!
          </p>
        </div>

        {/* GRID 8 THẺ BÀI LỚP 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card, idx) => {
            const isFlipped = flippedIndex.includes(idx) || matchedPairs.includes(card.pairId);

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`h-28 sm:h-32 rounded-2xl cursor-pointer flex items-center justify-center font-black text-lg sm:text-xl p-3 border-4 transition-all duration-300 transform select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-yellow-300 to-amber-400 text-amber-950 border-yellow-500 scale-105 shadow-md'
                    : 'btn-3d-purple text-white shadow-3d-purple hover:scale-105'
                }`}
              >
                {isFlipped ? card.text : '❓'}
              </div>
            );
          })}
        </div>

        {/* THẮNG GAME */}
        {gameCompleted && (
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-4 border-purple-400 p-6 rounded-3xl animate-bounce space-y-2">
            <h3 className="text-2xl font-black text-purple-950">
              🎉 CHÚC MỪNG EM ĐÃ GHÉP THÀNH CÔNG TẤT CẢ CÁC THẺ!
            </h3>
            <p className="text-sm font-extrabold text-purple-800">
              Em nhận thêm <span className="text-xl text-amber-900">+40 Xu 🪙</span> và <span className="text-xl text-sky-900">+60 XP 🌟</span>!
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
