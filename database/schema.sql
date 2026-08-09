-- ====================================================================
-- DỰ ÁN CLASSROOM APP - HỌC SINH LỚP 4
-- DATABASE SCHEMA (SUPABASE POSTGRESQL + RLS POLICIES)
-- ====================================================================

-- 1. BẢNG NGUỜI DÙNG (PROFILES - Giảng viên & Học sinh)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Liên kết Supabase Auth
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    avatar VARCHAR(50) DEFAULT '🐯 Phù Thủy Hổ',
    coins INT DEFAULT 150 CHECK (coins >= 0),
    diamonds INT DEFAULT 12 CHECK (diamonds >= 0),
    xp_points INT DEFAULT 350 CHECK (xp_points >= 0),
    grade_level INT DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG LỚP HỌC (CLASSES)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_name VARCHAR(100) NOT NULL,
    join_code VARCHAR(8) UNIQUE NOT NULL, -- Mã gia nhập lớp (Ví dụ: LOP4A123)
    subject VARCHAR(50) DEFAULT 'Toán & Tiếng Việt 4',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG THÀNH VIÊN LỚP HỌC (CLASS_STUDENTS)
CREATE TABLE IF NOT EXISTS public.class_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 4. BẢNG HỌC LIỆU & CÂU HỎI (QUESTIONS & MATERIALS)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(50) NOT NULL CHECK (subject IN ('Math', 'Vietnamese', 'English', 'Science')),
    grade INT DEFAULT 4,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"]
    correct_option INT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
    reward_coins INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG TRẠNG THÁI PHÒNG CHƠI REALTIME (GAME_SESSIONS)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    game_type VARCHAR(50) CHECK (game_type IN ('spin_wheel', 'quiz_arena', 'memory_cards')),
    status VARCHAR(20) CHECK (status IN ('waiting', 'active', 'finished')) DEFAULT 'waiting',
    current_question_index INT DEFAULT 0,
    room_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG TÚI ĐỒ & VẬT PHẨM HỌC SINH (STUDENT_INVENTORY)
CREATE TABLE IF NOT EXISTS public.student_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) CHECK (item_type IN ('avatar', 'badge', 'effect')),
    purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG NHẬT KÝ HỆ THỐNG (AUDIT & SYSTEM LOGS)
CREATE TABLE IF NOT EXISTS public.audit_system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS GUARD POLICIES)
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Policy: Học sinh chỉ xem được hồ sơ bản thân & danh sách xếp hạng
CREATE POLICY "Public profiles read policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Student update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = auth_id);

-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA LỚP 4)
INSERT INTO public.questions (subject, grade, question_text, options, correct_option, reward_coins) VALUES
('Math', 4, 'Số gồm 5 triệu, 4 trăm nghìn và 6 đơn vị được viết là:', '["5 400 006", "5 040 006", "5 400 600", "5 004 006"]', 0, 20),
('Math', 4, 'Giá trị của biểu thức 25 x 4 + 100 là bao nhiêu?', '["150", "200", "250", "300"]', 1, 25),
('Vietnamese', 4, 'Từ nào dưới đây là từ ghép tổng hợp?', '["Bánh chưng", "Sách vở", "Xe đạp", "Bút chì"]', 1, 20),
('English', 4, 'What is the capital of Vietnam?', '["Da Nang", "Ho Chi Minh City", "Hanoi", "Hue"]', 2, 20)
ON CONFLICT DO NOTHING;
