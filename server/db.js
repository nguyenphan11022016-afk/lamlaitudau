// Mock In-Memory Database & Redis ZSET Leaderboard Simulator
export const db = {
  // Profiles
  students: [
    { id: 'st-1', name: 'Bảo Nam (Lớp 4A)', avatar: '🐯 Hổ Dũng Cảm', coins: 450, diamonds: 28, xp: 1250, badge: 'Vua Toán Học' },
    { id: 'st-2', name: 'Linh Nhi (Lớp 4A)', avatar: '🐰 Thỏ Siêu Trí Tuệ', coins: 380, diamonds: 22, xp: 1100, badge: 'Ngôi Sao Sáng' },
    { id: 'st-3', name: 'Minh Đăng (Lớp 4B)', avatar: '🦁 Sư Tử Vui Vẻ', coins: 310, diamonds: 15, xp: 950, badge: 'Thám Tử Tiếng Việt' },
    { id: 'st-4', name: 'Khánh An (Lớp 4A)', avatar: '🐼 Gấu Trúc Thông Thái', coins: 270, diamonds: 12, xp: 820, badge: 'Chiến Binh Tiếng Anh' },
    { id: 'st-5', name: 'Gia Hưng (Lớp 4C)', avatar: '🦊 Cáo Nhanh Trí', coins: 210, diamonds: 8, xp: 680, badge: 'Mầm Non Sáng Tạo' },
  ],

  // Teachers
  teachers: [
    { id: 'tc-1', name: 'Cô Hồng Hạnh', school: 'Tiểu học Sao Mai', subject: 'Chủ nhiệm Lớp 4A' }
  ],

  // Classes
  classes: [
    { id: 'cls-1', name: 'Lớp 4A1 - Sao Mai', joinCode: '4A1SUPER', teacher: 'Cô Hồng Hạnh', studentCount: 28 },
    { id: 'cls-2', name: 'Đội Tuyển Ôn Thi Toán 4', joinCode: 'TOAN4A1', teacher: 'Cô Hồng Hạnh', studentCount: 15 },
  ],

  // Grade 4 Questions Bank
  questions: [
    {
      id: 1,
      subject: 'Toán',
      questionText: 'Số gồm 5 triệu, 4 trăm nghìn và 6 đơn vị được viết là:',
      options: ['5 400 006', '5 040 006', '5 400 600', '5 004 006'],
      correctOption: 0,
      rewardCoins: 30,
      hint: 'Hàng chục nghìn, hàng nghìn và hàng chục đều bằng 0 em nhé!'
    },
    {
      id: 2,
      subject: 'Toán',
      questionText: 'Trung bình cộng của ba số: 15, 25 và 50 là:',
      options: ['25', '30', '35', '40'],
      correctOption: 1,
      rewardCoins: 35,
      hint: 'Tính tổng 15 + 25 + 50 = 90, sau đó chia cho 3!'
    },
    {
      id: 3,
      subject: 'Tiếng Việt',
      questionText: 'Từ nào dưới đây mô tả tính nết chăm chỉ của học sinh?',
      options: ['Cần cù', 'Thật thà', 'Dũng cảm', 'Lịch sự'],
      correctOption: 0,
      rewardCoins: 25,
      hint: 'Cần cù bù thông minh!'
    },
    {
      id: 4,
      subject: 'Tiếng Anh',
      questionText: 'What day comes after Tuesday?',
      options: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
      correctOption: 1,
      rewardCoins: 30,
      hint: 'Monday -> Tuesday -> ...'
    },
    {
      id: 5,
      subject: 'Khoa Học',
      questionText: 'Nước tồn tại ở mấy thể chính?',
      options: ['1 thể', '2 thể', '3 thể (Rắn, Lỏng, Khí)', '4 thể'],
      correctOption: 2,
      rewardCoins: 25,
      hint: 'Đá lạnh, nước uống và hơi nước!'
    }
  ],

  // Shop Inventory Items
  shopItems: [
    { id: 'item-1', name: '👑 Vương Miện Vàng', type: 'avatar', cost: 100, icon: '👑', desc: 'Đội vương miện trên đầu avatar!' },
    { id: 'item-2', name: '🦄 Kỳ Lân Cầu Vồng', type: 'avatar', cost: 150, icon: '🦄', desc: 'Avatar kỳ lân cực xịn!' },
    { id: 'item-3', name: '🚀 Tên Lửa Siêu Tốc', type: 'effect', cost: 80, icon: '🚀', desc: 'Tăng gấp đôi tốc độ nhận Xu trong 1 giờ!' },
    { id: 'item-4', name: '🔮 Quả Cầu Gợi Ý', type: 'effect', cost: 50, icon: '🔮', desc: 'Xóa 2 đáp án sai trong Quiz!' },
    { id: 'item-5', name: '🛡️ Khiên Bảo Vệ XP', type: 'effect', cost: 120, icon: '🛡️', desc: 'Không bị trừ điểm khi làm sai.' },
  ],

  // Active Game Room State
  activeRoom: {
    roomCode: 'WONDER4',
    gameType: 'quiz_arena',
    status: 'active',
    currentQuestionIndex: 0,
    players: [
      { id: 'st-1', name: 'Bảo Nam', score: 120, status: 'ready' },
      { id: 'st-2', name: 'Linh Nhi', score: 90, status: 'ready' },
      { id: 'st-3', name: 'Minh Đăng', score: 60, status: 'ready' },
    ]
  },

  // Audit Logs
  logs: [
    { time: new Date().toLocaleTimeString('vi-VN'), action: 'Khởi tạo phòng chơi Quiz Arena WONDER4', user: 'Cô Hồng Hạnh' },
    { time: new Date().toLocaleTimeString('vi-VN'), action: 'Bảo Nam cộng +30 Xu từ Vòng Quay', user: 'Bảo Nam' }
  ]
};
