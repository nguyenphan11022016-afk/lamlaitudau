import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple Rate Limiter & Security Middleware Simulation
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const record = rateLimitMap.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
      if (record.count > maxRequests) {
        return res.status(429).json({ success: false, error: 'Phòng ngừa spam: Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' });
      }
    }
  }
  next();
});

// API 1: Lấy danh sách Học Sinh & Hồ Sơ (Profiles)
app.get('/api/students', (req, res) => {
  res.json({ success: true, data: db.students });
});

// API 2: Lấy Bảng Xếp Hạng Mini-League (Redis ZSET Leaderboard Sim)
app.get('/api/leaderboard', (req, res) => {
  // Sắp xếp theo XP giảm dần (Mô phỏng Redis ZREVRANGEBYSCORE)
  const leaderboard = [...db.students].sort((a, b) => b.xp - a.xp);
  res.json({
    success: true,
    cacheMode: 'Redis ZSET In-Memory',
    data: leaderboard.map((st, idx) => ({
      rank: idx + 1,
      name: st.name,
      avatar: st.avatar,
      xp: st.xp,
      coins: st.coins,
      badge: st.badge
    }))
  });
});

// API 3: Lấy Ngân hàng Câu hỏi Lớp 4
app.get('/api/questions', (req, res) => {
  const subject = req.query.subject;
  let result = db.questions;
  if (subject) {
    result = result.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }
  res.json({ success: true, count: result.length, data: result });
});

// API 4: Thêm Câu hỏi Mới (Góc Giáo Viên)
app.post('/api/questions', (req, res) => {
  const { subject, questionText, options, correctOption, rewardCoins, hint } = req.body;
  if (!questionText || !options || options.length < 4) {
    return res.status(400).json({ success: false, error: 'Dữ liệu câu hỏi không hợp lệ!' });
  }

  const newQuestion = {
    id: db.questions.length + 1,
    subject: subject || 'Toán',
    questionText,
    options,
    correctOption: parseInt(correctOption) || 0,
    rewardCoins: parseInt(rewardCoins) || 25,
    hint: hint || 'Hãy suy nghĩ kỹ nhé!'
  };

  db.questions.push(newQuestion);
  db.logs.unshift({
    time: new Date().toLocaleTimeString('vi-VN'),
    action: `Thêm câu hỏi mới môn ${newQuestion.subject}: "${newQuestion.questionText.slice(0, 30)}..."`,
    user: 'Cô Hồng Hạnh'
  });

  res.json({ success: true, message: 'Thêm câu hỏi thành công!', data: newQuestion });
});

// API 5: Nộp Bài & Cộng Xu/XP (Score & Evaluation Engine)
app.post('/api/submit-answer', (req, res) => {
  const { studentId, questionId, selectedOption, timeSeconds } = req.body;

  const question = db.questions.find(q => q.id === parseInt(questionId));
  if (!question) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy câu hỏi!' });
  }

  const isCorrect = question.correctOption === parseInt(selectedOption);
  let earnedCoins = 0;
  let earnedXP = 0;

  if (isCorrect) {
    // Thưởng thêm Xu nếu trả lời nhanh (< 8 giây)
    const speedBonus = timeSeconds && timeSeconds <= 8 ? 10 : 0;
    earnedCoins = question.rewardCoins + speedBonus;
    earnedXP = 50 + speedBonus;

    // Cập nhật cho học sinh
    const student = db.students.find(s => s.id === (studentId || 'st-1'));
    if (student) {
      student.coins += earnedCoins;
      student.xp += earnedXP;
    }

    db.logs.unshift({
      time: new Date().toLocaleTimeString('vi-VN'),
      action: `Học sinh trả lời ĐÚNG câu #${questionId} (+${earnedCoins} Xu, +${earnedXP} XP)`,
      user: student ? student.name : 'Học sinh'
    });
  } else {
    db.logs.unshift({
      time: new Date().toLocaleTimeString('vi-VN'),
      action: `Học sinh trả lời SAI câu #${questionId}`,
      user: 'Học sinh'
    });
  }

  res.json({
    success: true,
    isCorrect,
    correctOption: question.correctOption,
    earnedCoins,
    earnedXP,
    hint: !isCorrect ? question.hint : null
  });
});

// API 6: Lấy Danh Sách Vật Phẩm Shop & Mua Hàng
app.get('/api/shop', (req, res) => {
  res.json({ success: true, data: db.shopItems });
});

app.post('/api/shop/buy', (req, res) => {
  const { studentId, itemId } = req.body;
  const item = db.shopItems.find(i => i.id === itemId);
  const student = db.students.find(s => s.id === (studentId || 'st-1'));

  if (!item || !student) {
    return res.status(400).json({ success: false, error: 'Thông tin vật phẩm hoặc học sinh không hợp lệ!' });
  }

  if (student.coins < item.cost) {
    return res.status(400).json({ success: false, error: 'Em không đủ Xu để mua vật phẩm này rồi!' });
  }

  student.coins -= item.cost;
  db.logs.unshift({
    time: new Date().toLocaleTimeString('vi-VN'),
    action: `Đã mua vật phẩm "${item.name}" với giá ${item.cost} Xu`,
    user: student.name
  });

  res.json({
    success: true,
    message: `Chúc mừng em đã sở hữu ${item.name}!`,
    remainingCoins: student.coins
  });
});

// API 7: Lấy Danh Sách Lớp Học & Mã Join Code
app.get('/api/classes', (req, res) => {
  res.json({ success: true, data: db.classes });
});

// API 8: Lấy System Logs & Audit
app.get('/api/logs', (req, res) => {
  res.json({ success: true, data: db.logs.slice(0, 15) });
});

app.listen(PORT, () => {
  console.log(`🚀 Classroom App Backend API Server đang chạy tại: http://localhost:${PORT}`);
});
