import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Sparkles, CheckCircle2, XCircle, HelpCircle, Trophy } from 'lucide-react';
import { soundFx } from '../../soundEngine';

export default function QuizArenaGame({ student, onUpdateStudent, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (!isAnswered && timer > 0 && !loading) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !isAnswered) {
      // Hết giờ -> Tự động nộp bài sai
      handleSelectOption(-1);
    }
    return () => clearInterval(interval);
  }, [timer, isAnswered, loading]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (index) => {
    if (isAnswered) return;
    soundFx.playClick();
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const timeSpent = 15 - timer;

    try {
      const res = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          questionId: currentQ.id,
          selectedOption: index,
          timeSeconds: timeSpent
        })
      });

      const data = await res.json();
      setResultData(data);

      if (data.isCorrect) {
        soundFx.playCoin();
        onUpdateStudent({
          ...student,
          coins: student.coins + data.earnedCoins,
          xp: student.xp + data.earnedXP
        });
      } else {
        soundFx.playWrong();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setResultData(null);
      setTimer(15);
    } else {
      soundFx.playFanfare();
      alert('🎉 Chúc mừng em đã hoàn thành xuất sắc khoá Ôn Luyện Quiz 4!');
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-bold border-4 border-sky-100">
        Đang tải Đấu Trường Quiz Arena 15s...
      </div>
    );
  }

  const currentQ = questions[currentIndex];

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

        {/* TIMER ĐẾM NGƯỢC 15S */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black border-2 transition-all ${
          timer <= 5 ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse' : 'bg-sky-100 text-sky-900 border-sky-300'
        }`}>
          <Clock size={20} />
          <span>Thời Gian: {timer}s</span>
        </div>
      </div>

      {/* QUIZ CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-200 shadow-xl space-y-6">
        
        {/* PROGRESS & SUBJECT TAG */}
        <div className="flex items-center justify-between">
          <span className="bg-indigo-100 text-indigo-800 font-black text-xs px-3.5 py-1 rounded-full border border-indigo-200">
            📖 CÂU HỎI MÔN {currentQ.subject.toUpperCase()} LỚP 4
          </span>
          <span className="text-xs font-black text-slate-500">
            Câu {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* CÂU HỎI */}
        <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
            {currentQ.questionText}
          </h2>
        </div>

        {/* DẠNG ĐÁP ÁN 4 NÚT LỚN (CHO HỌC SINH LỚP 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'btn-3d-blue';
            if (isAnswered) {
              if (idx === currentQ.correctOption) {
                btnStyle = 'btn-3d-green';
              } else if (idx === selectedOption) {
                btnStyle = 'btn-3d-pink';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`btn-3d p-4 rounded-2xl font-black text-base text-left flex items-center justify-between shadow-md ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center font-black text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && idx === currentQ.correctOption && (
                  <CheckCircle2 size={24} className="text-white" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctOption && (
                  <XCircle size={24} className="text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* KẾT QUẢ & THƯỞNG */}
        {resultData && (
          <div className={`p-6 rounded-2xl border-4 space-y-3 animate-bounce ${
            resultData.isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}>
            <div className="flex items-center gap-3">
              {resultData.isCorrect ? (
                <>
                  <Sparkles size={28} className="text-emerald-600" />
                  <h3 className="text-xl font-black">CHÍNH XÁC RỒI! THẦN ĐỒNG LỚP 4! 🥳</h3>
                </>
              ) : (
                <>
                  <HelpCircle size={28} className="text-rose-600" />
                  <h3 className="text-xl font-black">TIẾC QUÁ! CHƯA CHÍNH XÁC RỒI! 😅</h3>
                </>
              )}
            </div>

            {resultData.isCorrect ? (
              <p className="text-sm font-extrabold">
                Em nhận được <span className="text-lg text-amber-600">+{resultData.earnedCoins} Xu 🪙</span> và <span className="text-lg text-sky-600">+{resultData.earnedXP} XP 🌟</span>!
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-bold text-rose-800 bg-rose-100 p-3 rounded-xl">
                💡 <b>Gợi ý giải bài:</b> {resultData.hint}
              </p>
            )}
          </div>
        )}

        {/* NÚT CÂU HỎI TIẾP THEO */}
        {isAnswered && (
          <div className="text-right">
            <button
              onClick={handleNextQuestion}
              className="btn-3d btn-3d-yellow px-6 py-3.5 rounded-2xl font-black text-base"
            >
              CÂU HỎI TIẾP THEO ➔
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
