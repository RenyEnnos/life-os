-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    professor TEXT,
    schedule TEXT,
    color TEXT DEFAULT '#3b82f6',
    semester TEXT,
    grade NUMERIC,
    credits INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('exam', 'homework', 'project', 'quiz', 'presentation', 'other')),
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'submitted', 'graded')),
    weight NUMERIC,
    grade NUMERIC,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Courses Policies
CREATE POLICY "Users can view their own courses"
    ON public.courses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own courses"
    ON public.courses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
    ON public.courses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
    ON public.courses FOR DELETE
    USING (auth.uid() = user_id);

-- Assignments Policies
CREATE POLICY "Users can view their own assignments"
    ON public.assignments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignments"
    ON public.assignments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments"
    ON public.assignments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments"
    ON public.assignments FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_courses_user_id ON public.courses(user_id);
CREATE INDEX idx_assignments_user_id ON public.assignments(user_id);
CREATE INDEX idx_assignments_course_id ON public.assignments(course_id);
