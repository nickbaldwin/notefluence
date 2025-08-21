-- Migration for existing projects
-- This handles any existing projects that might not have owner_id set

-- First, let's check if there are any projects without owner_id
-- If there are, we'll need to either assign them to a default user or mark them as public

-- For now, let's make any projects without owner_id public so they're accessible
UPDATE public.projects
SET is_public = true
WHERE owner_id IS NULL;

-- Since we can't add NOT NULL constraint to a column that has NULL values,
-- we'll skip that constraint for now. The application logic will ensure
-- new projects always have owner_id set.

-- Add a foreign key constraint to ensure owner_id references a valid user
-- (This will only affect new projects, not existing ones)
-- Note: If the constraint already exists, this will be skipped
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projects_owner_id_fkey' 
        AND table_name = 'projects'
    ) THEN
        ALTER TABLE public.projects
        ADD CONSTRAINT projects_owner_id_fkey
        FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;
