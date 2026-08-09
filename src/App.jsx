import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Leaderboard from './components/Leaderboard';
import ShopInventory from './components/ShopInventory';
import SpinWheelGame from './components/games/SpinWheelGame';
import QuizArenaGame from './components/games/QuizArenaGame';
import MemoryCardsGame from './components/games/MemoryCardsGame';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'games' | 'leaderboard' | 'shop'
  const [activeGame, setActiveGame] = useState(null); // null | 'spin_wheel' | 'quiz_arena' | 'memory_cards'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Profile Học Sinh mặc định (Bảo Nam - Lớp 4A)
  const [student, setStudent] = useState({
    id: 'st-1',
    name: 'Bảo Nam (Lớp 4A1)',
    avatar: '🐯 Phù Thủy Hổ',
    coins: 450,
    diamonds: 28,
    xp: 1250,
    badge: 'Vua Toán Học'
  });

  const handleSelectGame = (gameKey) => {
    setActiveGame(gameKey);
  };

  const handleBackFromGame = () => {
    setActiveGame(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* NAVBAR TRÊN CÙNG */}
      <Navbar 
        student={student}
        currentRole={role}
        setRole={setRole}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveGame(null);
        }}
      />

      {/* BODY CONTENT CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {role === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          <>
            {/* HỌC SINH SUB-GAME SCREENS */}
            {activeGame === 'spin_wheel' && (
              <SpinWheelGame 
                student={student} 
                onUpdateStudent={setStudent} 
                onBack={handleBackFromGame} 
              />
            )}

            {activeGame === 'quiz_arena' && (
              <QuizArenaGame 
                student={student} 
                onUpdateStudent={setStudent} 
                onBack={handleBackFromGame} 
              />
            )}

            {activeGame === 'memory_cards' && (
              <MemoryCardsGame 
                student={student} 
                onUpdateStudent={setStudent} 
                onBack={handleBackFromGame} 
              />
            )}

            {/* TAB KHÁC NẾU KHÔNG TRONG GAME ACTIVE */}
            {!activeGame && (
              <>
                {activeTab === 'home' && (
                  <StudentDashboard 
                    student={student}
                    onSelectTab={setActiveTab}
                    onSelectGame={handleSelectGame}
                  />
                )}

                {activeTab === 'games' && (
                  <div className="space-y-6 animate-pop-in">
                    <div className="bg-gradient-to-r from-sky-400 to-indigo-500 rounded-3xl p-6 text-white border-4 border-sky-300 shadow-xl">
                      <h1 className="text-3xl font-black">🎮 Đấu Trường Game Lớp 4</h1>
                      <p className="text-sm font-semibold text-sky-100 mt-1">
                        Chọn trò chơi để vừa ôn luyện bài vừa rinh về nhiều Xu thưởng!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div 
                        onClick={() => handleSelectGame('spin_wheel')}
                        className="wonder-card p-6 border-yellow-300 hover:border-yellow-500 bg-gradient-to-b from-yellow-50 to-white cursor-pointer text-center space-y-4"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-yellow-400 text-4xl flex items-center justify-center mx-auto shadow-3d-yellow">
                          🎡
                        </div>
                        <h2 className="text-xl font-black text-amber-950">Vòng Quay Kỳ Diệu</h2>
                        <p className="text-xs text-slate-500 font-semibold">Canvas HTML5 quay thưởng nhận Xu cực lớn!</p>
                        <button className="btn-3d btn-3d-yellow w-full py-2.5 rounded-xl text-xs font-black">
                          CHƠI NGAY ➔
                        </button>
                      </div>

                      <div 
                        onClick={() => handleSelectGame('quiz_arena')}
                        className="wonder-card p-6 border-sky-300 hover:border-sky-500 bg-gradient-to-b from-sky-50 to-white cursor-pointer text-center space-y-4"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-sky-400 text-4xl flex items-center justify-center mx-auto shadow-3d-blue">
                          🧠
                        </div>
                        <h2 className="text-xl font-black text-sky-950">Đấu Trường Quiz 15s</h2>
                        <p className="text-xs text-slate-500 font-semibold">Trắc nghiệm đếm ngược thưởng thêm Xu tốc độ!</p>
                        <button className="btn-3d btn-3d-blue w-full py-2.5 rounded-xl text-xs font-black">
                          CHƠI NGAY ➔
                        </button>
                      </div>

                      <div 
                        onClick={() => handleSelectGame('memory_cards')}
                        className="wonder-card p-6 border-purple-300 hover:border-purple-500 bg-gradient-to-b from-purple-50 to-white cursor-pointer text-center space-y-4"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-purple-400 text-4xl flex items-center justify-center mx-auto shadow-3d-purple">
                          🃏
                        </div>
                        <h2 className="text-xl font-black text-purple-950">Lật Thẻ Trí Nhớ</h2>
                        <p className="text-xs text-slate-500 font-semibold">Ghép cặp phép tính & từ vựng Tiếng Việt 4!</p>
                        <button className="btn-3d btn-3d-purple w-full py-2.5 rounded-xl text-xs font-black">
                          CHƠI NGAY ➔
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'leaderboard' && (
                  <Leaderboard student={student} />
                )}

                {activeTab === 'shop' && (
                  <ShopInventory student={student} onUpdateStudent={setStudent} />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* FOOTER HIỂN THỊ THÔNG TIN ĐỒ ÁN & TÁC GIẢ SƠ ĐỒ */}
      <footer className="bg-white/80 border-t-2 border-sky-100 py-6 text-center text-xs font-bold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Dự án Classroom App - Thiết kế phù hợp với Học Sinh Lớp 4 ✨</span>
          <span>Dựa trên sơ đồ xuất bản bởi: <strong className="text-sky-700">nguyenphan11022016</strong></span>
        </div>
      </footer>

    </div>
  );
}
