-- Create tables for calendar maker application

-- Time slots table
CREATE TABLE time_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    UNIQUE(start_time, end_time, day_of_week)
);

-- Courses table
CREATE TABLE courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE(code)
);

-- Classes table
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    UNIQUE(name, level)
);

-- Rooms table
CREATE TABLE rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    UNIQUE(name)
);

-- Teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    UNIQUE(email)
);

-- Schedule table
CREATE TABLE schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_slot_id UUID NOT NULL REFERENCES time_slots(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    room_id UUID NOT NULL REFERENCES rooms(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    UNIQUE(time_slot_id, class_id),
    UNIQUE(time_slot_id, room_id),
    UNIQUE(time_slot_id, teacher_id)
);

-- Create indexes for better performance
CREATE INDEX idx_schedule_time_slot ON schedule(time_slot_id);
CREATE INDEX idx_schedule_course ON schedule(course_id);
CREATE INDEX idx_schedule_class ON schedule(class_id);
CREATE INDEX idx_schedule_room ON schedule(room_id);
CREATE INDEX idx_schedule_teacher ON schedule(teacher_id); 