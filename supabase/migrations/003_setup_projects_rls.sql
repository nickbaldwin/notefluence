-- Set up Row Level Security for projects table
-- This ensures users can only access projects they own

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create policies for projects table

-- Users can view their own projects
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can view public projects (optional - for sharing)
CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (is_public = true);

-- Users can create projects
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- Create index for better performance on owner_id lookups
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);
