import React from 'react';
import { Trophy, Coins, Gem, Volume2, VolumeX, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { soundFx } from '../soundEngine';

export default function Navbar({ student, currentRole, setRole, soundEnabled, setSoundEnabled, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-sky-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO CLASSROOM APP LỚP 4 */}
        <div 
          onClick={() => { soundFx.playClick(); setActiveTab('home'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-300 flex items-center justify-center text-2xl shadow-3d-yellow transform group-hover:scale-110 transition-transform">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Lớp Học Kỳ Diệu
              </span>
              <span className="bg-yellow-400 text-yellow-950 font-bold text-xs px-2.5 py-0.5 rounded-full border-2 border-yellow-500 shadow-sm">
                LỚP 4
              </span>
            </div>
            <p className="text-xs text-sky-600 font-semibold hidden sm:block">
              Học Mà Chơi - Chơi Mà Học ✨
            </p>
          </div>
        </div>

        {/* THÔNG TIN XU, KIM CƯƠNG & KHU VỰC HỌC SINH */}
        {currentRole === 'student' ? (
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* THẺ XU 🪙 */}
            <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm">
              <span className="text-xl animate-bounce-slow">🪙</span>
              <span className="font-extrabold text-amber-900 text-sm sm:text-base">
                {student.coins} <span className="text-xs font-bold text-amber-700">Xu</span>
              </span>
            </div>

            {/* THẺ KIM CƯƠNG 💎 */}
            <div className="flex items-center gap-1.5 bg-cyan-50 border-2 border-cyan-300 px-3 py-1.5 rounded-2xl shadow-sm">
              <span className="text-xl">💎</span>
              <span className="font-extrabold text-cyan-900 text-sm sm:text-base">
                {student.diamonds} <span className="text-xs font-bold text-cyan-700">KC</span>
              </span>
            </div>

            {/* ĐO ỐNG XP */}
            <div className="hidden md:flex flex-col w-28">
              <div className="flex justify-between text-xs font-bold text-sky-700 mb-0.5">
                <span>XP Level 4</span>
                <span>{student.xp}</span>
              </div>
              <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden border border-sky-300">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (student.xp / 1500) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* AVATAR HỌC SINH */}
            <div className="flex items-center gap-2 bg-sky-100 border-2 border-sky-300 pl-2 pr-3 py-1 rounded-2xl">
              <span className="text-2xl">{student.avatar.split(' ')[0]}</span>
              <span className="font-bold text-sky-900 text-xs sm:text-sm hidden lg:block">
                {student.name.split(' ')[0]} {student.name.split(' ')[1]}
              </span>
            </div>

          </div>
        ) : (
          /* THÔNG TIN GIÁO VIÊN */
          <div className="flex items-center gap-2 bg-indigo-50 border-2 border-indigo-200 px-4 py-2 rounded-2xl">
            <span className="text-2xl">🍎</span>
            <div>
              <span className="font-extrabold text-indigo-900 text-sm block">Cô Hồng Hạnh</span>
              <span className="text-xs text-indigo-600 font-semibold">Chủ nhiệm Lớp 4A1</span>
            </div>
          </div>
        )}

        {/* NÚT BẬT/TẮT ÂM THANH & CHUYỂN ROLE */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const nextSound = !soundEnabled;
              setSoundEnabled(nextSound);
              soundFx.enabled = nextSound;
              if (nextSound) soundFx.playClick();
            }}
            className="w-10 h-10 rounded-xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 flex items-center justify-center text-sky-800 font-bold transition-colors"
            title={soundEnabled ? "Tắt Âm Thanh" : "Bật Âm Thanh"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-slate-400" />}
          </button>

          {/* Role Switcher */}
          <button
            onClick={() => {
              soundFx.playClick();
              const nextRole = currentRole === 'student' ? 'teacher' : 'student';
              setRole(nextRole);
              setActiveTab('home');
            }}
            className={`btn-3d px-3 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm ${
              currentRole === 'student'
                ? 'btn-3d-purple'
                : 'btn-3d-green'
            }`}
          >
            {currentRole === 'student' ? (
              <>🍎 <span>Góc Giáo Viên</span></>
            ) : (
              <>🎒 <span>Chế Độ Học Sinh</span></>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
