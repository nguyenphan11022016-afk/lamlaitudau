import React from 'react';
import { Gamepad2, Trophy, ShoppingBag, Sparkles, BookOpen, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { soundFx } from '../soundEngine';

export default function StudentDashboard({ student, onSelectTab, onSelectGame }) {
  return (
    <div className="space-y-8 animate-pop-in">
      
      {/* BANNER CHÀO MỪNG HỌC SINH LỚP 4 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 p-6 sm:p-8 text-white shadow-2xl border-4 border-sky-300">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-950 px-3.5 py-1 rounded-full font-black text-xs sm:text-sm border-2 border-yellow-300 shadow-sm">
              ✨ Xin chào, {student.name}!
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
              Sẵn Sàng Chinh Phục Kiến Thức Lớp 4?
            </h1>
            <p className="text-sky-100 text-sm sm:text-base max-w-xl font-medium">
              Tích lũy thật nhiều <span className="font-extrabold text-yellow-300">Xu 🪙</span> và <span className="font-extrabold text-cyan-200">Kim Cương 💎</span> để đổi lấy những chiếc Avatar Siêu Xịn nhé!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => { soundFx.playSuccess(); onSelectTab('games'); }}
              className="btn-3d btn-3d-yellow px-6 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg"
            >
              <Gamepad2 size={24} />
              <span>VÀO CHƠI GAME NGAY!</span>
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH KHU VỰC CHÍNH (4 CARD LỚN CHỦ ĐẠO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: ĐẤU TRƯỜNG GAME */}
        <div 
          onClick={() => { soundFx.playClick(); onSelectTab('games'); }}
          className="wonder-card p-6 cursor-pointer border-sky-300 hover:border-sky-500 bg-gradient-to-b from-sky-50 to-white flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-400 text-white flex items-center justify-center text-3xl shadow-3d-blue transform group-hover:rotate-6 transition-transform">
              🎮
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Đấu Trường Game</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Vòng quay kỳ diệu, Quiz 15s đếm ngược & Lật thẻ trí nhớ!
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between font-bold text-sky-600 group-hover:text-sky-700 text-sm">
            <span>Khám phá 3 trò chơi</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 2: BẢNG VÀNG VINH DANH */}
        <div 
          onClick={() => { soundFx.playClick(); onSelectTab('leaderboard'); }}
          className="wonder-card p-6 cursor-pointer border-amber-300 hover:border-amber-500 bg-gradient-to-b from-amber-50 to-white flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-3d-yellow transform group-hover:rotate-6 transition-transform">
              🏆
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Bảng Vàng Vinh Danh</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Mini-League xếp hạng Xu & XP tuần này của Lớp 4A!
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between font-bold text-amber-700 group-hover:text-amber-800 text-sm">
            <span>Xem thứ hạng Lớp 4</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: RƯƠNG BÁU & SHOP */}
        <div 
          onClick={() => { soundFx.playClick(); onSelectTab('shop'); }}
          className="wonder-card p-6 cursor-pointer border-purple-300 hover:border-purple-500 bg-gradient-to-b from-purple-50 to-white flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-400 text-white flex items-center justify-center text-3xl shadow-3d-purple transform group-hover:rotate-6 transition-transform">
              🎒
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Cửa Hàng Vật Phẩm</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Đổi Xu lấy Vương miện, Kỳ lân & Thẻ nhân đôi phần thưởng!
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between font-bold text-purple-600 group-hover:text-purple-700 text-sm">
            <span>Mở kho quà tặng</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: ÔN LUYỆN BÀI TẬP */}
        <div 
          onClick={() => { soundFx.playClick(); onSelectGame('quiz_arena'); }}
          className="wonder-card p-6 cursor-pointer border-emerald-300 hover:border-emerald-500 bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-emerald-950 flex items-center justify-center text-3xl shadow-3d-green transform group-hover:rotate-6 transition-transform">
              📚
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Kho Ôn Luyện 4</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Luyện tập Toán, Tiếng Việt, Tiếng Anh & Khoa Học 4.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between font-bold text-emerald-700 group-hover:text-emerald-800 text-sm">
            <span>Bắt đầu ôn tập</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* QUICK GAME SELECTION LIST */}
      <div className="bg-white rounded-3xl p-6 border-4 border-sky-100 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={24} />
            <h3 className="text-xl font-black text-slate-800">Chọn Nhanh Trò Chơi Yêu Thích</h3>
          </div>
          <span className="text-xs font-extrabold text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            3 Template HTML5/Canvas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Game 1: Vòng quay */}
          <div 
            onClick={() => { soundFx.playClick(); onSelectGame('spin_wheel'); }}
            className="bg-gradient-to-br from-yellow-100 to-amber-50 p-4 rounded-2xl border-2 border-yellow-300 cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-2xl flex items-center justify-center shadow-3d-yellow">
              🎡
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-base">Vòng Quay Kỳ Diệu</h4>
              <p className="text-xs text-amber-800 font-medium">Quay chọn ngẫu nhiên & nhận Xu</p>
            </div>
          </div>

          {/* Game 2: Quiz Arena */}
          <div 
            onClick={() => { soundFx.playClick(); onSelectGame('quiz_arena'); }}
            className="bg-gradient-to-br from-sky-100 to-blue-50 p-4 rounded-2xl border-2 border-sky-300 cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-400 text-2xl flex items-center justify-center shadow-3d-blue">
              🧠
            </div>
            <div>
              <h4 className="font-extrabold text-sky-950 text-base">Đấu Trường Quiz 15s</h4>
              <p className="text-xs text-sky-800 font-medium">Đếm ngược trắc nghiệm nổ xu</p>
            </div>
          </div>

          {/* Game 3: Memory Cards */}
          <div 
            onClick={() => { soundFx.playClick(); onSelectGame('memory_cards'); }}
            className="bg-gradient-to-br from-purple-100 to-pink-50 p-4 rounded-2xl border-2 border-purple-300 cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-400 text-2xl flex items-center justify-center shadow-3d-purple">
              🃏
            </div>
            <div>
              <h4 className="font-extrabold text-purple-950 text-base">Lật Thẻ Trí Nhớ</h4>
              <p className="text-xs text-purple-800 font-medium">Ghép cặp công thức & từ vựng</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
