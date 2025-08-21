-- Fix RLS Security Issue
-- This script will diagnose and fix the problem where users can see other users' projects

-- Step 1: Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'projects' AND schemaname = 'public';

-- Step 2: Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'projects' AND schemaname = 'public'
ORDER BY policyname;

-- Step 3: Force enable RLS (in case it was disabled)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Step 5: Create strict RLS policies
-- Users can ONLY view their own projects (no public projects for now)
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can create projects (owner_id will be set by the application)
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- Step 6: Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'projects' AND schemaname = 'public'
ORDER BY policyname;

-- Step 7: Check if there are any projects without owner_id (these would be accessible to everyone)
SELECT COUNT(*) as projects_without_owner
FROM public.projects 
WHERE owner_id IS NULL;

-- Step 8: Show sample projects to verify owner_id is set correctly
SELECT id, title, owner_id, created_at 
FROM public.projects 
ORDER BY created_at DESC 
LIMIT 5;
