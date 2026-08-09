import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, BookOpen, Key, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../soundEngine';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);

  // Form Thêm Câu Hỏi Mới
  const [subject, setSubject] = useState('Toán');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState(0);
  const [rewardCoins, setRewardCoins] = useState(25);
  const [hint, setHint] = useState('');

  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const [resClasses, resStudents, resLogs] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/students'),
        fetch('/api/logs')
      ]);

      const dataCls = await resClasses.json();
      const dataSt = await resStudents.json();
      const dataLogs = await resLogs.json();

      if (dataCls.success) setClasses(dataCls.data);
      if (dataSt.success) setStudents(dataSt.data);
      if (dataLogs.success) setLogs(dataLogs.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    soundFx.playClick();

    if (!questionText || !optA || !optB || !optC || !optD) {
      alert('Cô vui lòng điền đầy đủ câu hỏi và 4 lựa chọn nhé!');
      return;
    }

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          questionText,
          options: [optA, optB, optC, optD],
          correctOption,
          rewardCoins,
          hint
        })
      });

      const data = await res.json();
      if (data.success) {
        soundFx.playSuccess();
        setStatusMsg(`Đã tạo thành công câu hỏi môn ${subject}!`);
        setQuestionText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        setHint('');
        fetchTeacherData();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-pop-in">
      
      {/* BANNER GÓC GIÁO VIÊN */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white border-4 border-indigo-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner backdrop-blur-md">
            🍎
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide">
                Bảng Điều Khiển Giáo Viên (Teacher Hub)
              </h1>
              <span className="bg-emerald-400 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-indigo-100 mt-1">
              Quản lý danh sách Lớp 4A1, Mã gia nhập Join Code & Kho Học Liệu Thực Tế
            </p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH LỚP HỌC MÃ JOIN CODE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="wonder-card p-6 border-indigo-200 bg-indigo-50/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                  {cls.subject}
                </span>
                <h3 className="text-xl font-black text-slate-800">{cls.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Giáo viên: {cls.teacher}</p>
              </div>

              {/* MÃ JOIN CODE */}
              <div className="bg-white border-2 border-indigo-300 px-4 py-2 rounded-2xl text-center shadow-sm">
                <span className="text-[10px] font-black text-indigo-500 block uppercase">MÃ JOIN CODE</span>
                <span className="text-lg font-black text-indigo-900 tracking-wider">{cls.joinCode}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Users size={16} className="text-indigo-600" />
                Sĩ số: {cls.studentCount} Học sinh
              </span>
              <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Đang trực tuyến 🟢
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FORM THÊM CÂU HỎI MỚI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-md space-y-6">
        <div className="flex items-center gap-3">
          <PlusCircle className="text-indigo-600" size={28} />
          <div>
            <h2 className="text-xl font-black text-slate-800">Tạo Câu Hỏi Mới Kho Học Liệu Lớp 4</h2>
            <p className="text-xs text-slate-500 font-semibold">Tạo đề trắc nghiệm cập nhật ngay vào Đấu Trường Quiz Arena 15s</p>
          </div>
        </div>

        {statusMsg && (
          <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl flex items-center gap-2 font-bold animate-bounce">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Môn Học:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 outline-none"
              >
                <option value="Toán">Toán Lớp 4</option>
                <option value="Tiếng Việt">Tiếng Việt Lớp 4</option>
                <option value="Tiếng Anh">Tiếng Anh Lớp 4</option>
                <option value="Khoa Học">Khoa Học Lớp 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Phần Thưởng Xu 🪙:</label>
              <input
                type="number"
                value={rewardCoins}
                onChange={(e) => setRewardCoins(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1">Nội dung câu hỏi:</label>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ví dụ: Trung bình cộng của hai số 40 và 60 là bao nhiêu?"
              className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* 4 ĐÁP ÁN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Đáp án A:</label>
              <input
                type="text"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                placeholder="Đáp án A"
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Đáp án B:</label>
              <input
                type="text"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                placeholder="Đáp án B"
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Đáp án C:</label>
              <input
                type="text"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                placeholder="Đáp án C"
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Đáp án D:</label>
              <input
                type="text"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                placeholder="Đáp án D"
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Đáp án đúng:</label>
              <select
                value={correctOption}
                onChange={(e) => setCorrectOption(parseInt(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              >
                <option value={0}>Đáp án A</option>
                <option value={1}>Đáp án B</option>
                <option value={2}>Đáp án C</option>
                <option value={3}>Đáp án D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase mb-1">Gợi ý giải bài (nếu chọn sai):</label>
              <input
                type="text"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Ví dụ: Tính tổng 40 + 60 = 100 rồi chia cho 2!"
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="text-right pt-2">
            <button
              type="submit"
              className="btn-3d btn-3d-purple px-6 py-3 rounded-2xl font-black text-base shadow-md"
            >
              ➕ TẠO CÂU HỎI MỚI NGAY
            </button>
          </div>
        </form>
      </div>

      {/* SYSTEM AUDIT LOGS DB (Chuẩn theo Sơ đồ kiến trúc) */}
      <div className="bg-white rounded-3xl p-6 border-4 border-indigo-100 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="text-indigo-600" size={24} />
          <h3 className="text-lg font-black text-slate-800">
            System Audit Logs DB (Nhật Ký Thao Tác Hệ Thống Realtime)
          </h3>
        </div>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
          {logs.map((lg, i) => (
            <div key={i} className="flex items-start gap-2 border-b border-slate-800 pb-1.5">
              <span className="text-emerald-400 font-bold">[{lg.time}]</span>
              <span className="text-yellow-400 font-bold">[{lg.user}]:</span>
              <span className="text-slate-300">{lg.action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
