import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Zap, RefreshCw } from 'lucide-react';
import { soundFx } from '../soundEngine';

export default function Leaderboard({ student }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success) {
        setLeaders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-pop-in">
      
      {/* HEADER BẢNG VÀNG */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 text-amber-950 border-4 border-yellow-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
            👑
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide">
              Bảng Vàng Vinh Danh Lớp 4A
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
              Hệ thống xử lý xếp hạng Realtime Mini-League (Redis Cache Engine) ⚡
            </p>
          </div>
        </div>

        <button
          onClick={() => { soundFx.playClick(); fetchLeaderboard(); }}
          className="btn-3d btn-3d-yellow px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>CẬP NHẬT RANK</span>
        </button>
      </div>

      {/* TOP 3 PODIUM VINH DANH */}
      {!loading && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4">
          
          {/* HẠNG 2 (BẠC) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 border-4 border-slate-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {leaders[1].avatar.split(' ')[0]}
              </div>
              <div className="absolute -top-3 -right-2 bg-slate-300 text-slate-800 w-7 h-7 rounded-full font-black text-xs flex items-center justify-center border-2 border-white">
                2
              </div>
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-800 text-center line-clamp-1">
              {leaders[1].name}
            </span>
            <span className="text-xs font-bold text-slate-500">{leaders[1].xp} XP</span>
            <div className="w-full bg-gradient-to-t from-slate-200 to-slate-100 h-24 rounded-t-2xl mt-2 border-t-4 border-slate-300 flex items-center justify-center font-black text-slate-500 text-xl">
              🥈 2nd
            </div>
          </div>

          {/* HẠNG 1 (VÀNG - CAO NHẤT) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                👑
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center text-4xl sm:text-5xl shadow-lg">
                {leaders[0].avatar.split(' ')[0]}
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 w-8 h-8 rounded-full font-black text-xs flex items-center justify-center border-2 border-white shadow">
                1
              </div>
            </div>
            <span className="font-extrabold text-sm sm:text-base text-yellow-950 text-center line-clamp-1">
              {leaders[0].name}
            </span>
            <span className="text-xs font-black text-amber-600">{leaders[0].xp} XP 🌟</span>
            <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-200 h-32 rounded-t-2xl mt-2 border-t-4 border-yellow-400 flex items-center justify-center font-black text-yellow-800 text-2xl shadow-md">
              🥇 1st
            </div>
          </div>

          {/* HẠNG 3 (ĐỒNG) */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 border-4 border-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {leaders[2].avatar.split(' ')[0]}
              </div>
              <div className="absolute -top-3 -right-2 bg-amber-600 text-white w-7 h-7 rounded-full font-black text-xs flex items-center justify-center border-2 border-white">
                3
              </div>
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-slate-800 text-center line-clamp-1">
              {leaders[2].name}
            </span>
            <span className="text-xs font-bold text-amber-800">{leaders[2].xp} XP</span>
            <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100 h-20 rounded-t-2xl mt-2 border-t-4 border-amber-500 flex items-center justify-center font-black text-amber-800 text-lg">
              🥉 3rd
            </div>
          </div>

        </div>
      )}

      {/* DANH SÁCH CHI TIẾT BẢNG XẾP HẠNG */}
      <div className="bg-white rounded-3xl p-6 border-4 border-sky-100 shadow-md space-y-3">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <Trophy className="text-amber-500" size={20} />
          <span>Danh Sách Đầy Đủ Chi Chiến Binh Lớp 4</span>
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">
            Đang tải dữ liệu Bảng Vàng...
          </div>
        ) : (
          leaders.map((item) => (
            <div 
              key={item.rank}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                item.rank === 1 
                  ? 'bg-yellow-50 border-yellow-300' 
                  : item.rank === 2
                  ? 'bg-slate-50 border-slate-300'
                  : item.rank === 3
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-sky-50/30 border-sky-100 hover:bg-sky-50'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Thứ hạng */}
                <div className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center ${
                  item.rank === 1 ? 'bg-yellow-400 text-yellow-950' :
                  item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                  item.rank === 3 ? 'bg-amber-500 text-white' :
                  'bg-sky-100 text-sky-800'
                }`}>
                  #{item.rank}
                </div>

                {/* Avatar */}
                <span className="text-2xl sm:text-3xl">{item.avatar.split(' ')[0]}</span>

                {/* Tên & Badge */}
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{item.name}</h4>
                  <span className="inline-block text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* XP & Coins */}
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-black text-sky-700 text-sm sm:text-base block">
                    {item.xp} XP
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    🪙 {item.coins} Xu
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
