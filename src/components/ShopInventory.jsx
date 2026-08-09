import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundFx } from '../soundEngine';

export default function ShopInventory({ student, onUpdateStudent }) {
  const [items, setItems] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const res = await fetch('/api/shop');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuy = async (item) => {
    if (student.coins < item.cost) {
      soundFx.playWrong();
      setError(`Em còn thiếu ${item.cost - student.coins} Xu để mua "${item.name}"!`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, itemId: item.id })
      });
      const data = await res.json();
      if (data.success) {
        soundFx.playCoin();
        onUpdateStudent({ ...student, coins: data.remainingCoins });
        setPurchasedIds([...purchasedIds, item.id]);
        setMessage(data.message);
        setTimeout(() => setMessage(''), 3000);
      } else {
        soundFx.playWrong();
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-pop-in">
      
      {/* HEADER SHOP VẬT PHẨM */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-3xl p-6 text-white border-4 border-purple-300 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner backdrop-blur-md">
            🎒
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide">
              Cửa Hàng Quà Tặng & Vật Phẩm 4
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-purple-100 mt-1">
              Dùng Xu 🪙 kiếm được từ các bài học để đổi vật phẩm Siêu Độc Đáo!
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-yellow-400 text-yellow-950 font-black px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-sm">
          <span>Xu Hiện Có:</span>
          <span className="text-lg">{student.coins} 🪙</span>
        </div>
      </div>

      {/* THÔNG BÁO MUA HÀNG */}
      {message && (
        <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 font-extrabold animate-bounce">
          <CheckCircle2 size={24} className="text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-100 border-2 border-rose-400 text-rose-900 p-4 rounded-2xl flex items-center gap-3 font-extrabold">
          <AlertCircle size={24} className="text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* GRID VẬT PHẨM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isOwned = purchasedIds.includes(item.id);
          const canAfford = student.coins >= item.cost;

          return (
            <div 
              key={item.id}
              className="wonder-card p-5 border-purple-200 hover:border-purple-400 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-4xl mx-auto shadow-inner">
                  {item.icon}
                </div>
                <div className="text-center">
                  <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 mb-1">
                    {item.type === 'avatar' ? 'Avatar Độc Quyền' : 'Thẻ Bổ Trợ'}
                  </span>
                  <h3 className="text-lg font-black text-slate-800">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{item.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                <div className="font-extrabold text-amber-700 text-base">
                  🪙 {item.cost} Xu
                </div>

                <button
                  disabled={isOwned}
                  onClick={() => handleBuy(item)}
                  className={`btn-3d px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                    isOwned
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300'
                      : canAfford
                      ? 'btn-3d-yellow'
                      : 'bg-amber-100 text-amber-700 opacity-60'
                  }`}
                >
                  {isOwned ? (
                    <><span>Đã Sở Hữu</span></>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>ĐỔI NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
