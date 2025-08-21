-- Migration 005: Add Public Projects Policy
-- This allows users to view projects marked as public, regardless of ownership

-- Drop existing public projects policy if it exists
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;

-- Create new public projects policy that allows viewing public projects
-- This policy should be checked BEFORE the owner-specific policy
CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (is_public = true);

-- Note: The existing "Users can view their own projects" policy will still apply
-- for private projects, so users can see:
-- 1. Their own projects (private or public)
-- 2. Any project marked as public (regardless of owner)

-- Create index for better performance on public project queries
CREATE INDEX IF NOT EXISTS projects_is_public_idx ON public.projects(is_public);
