-- IMMEDIATE SECURITY FIX
-- This will fix the critical security issue where users can see other users' projects

-- Step 1: Check what we're dealing with
SELECT 'Projects with NULL owner_id:' as status;
SELECT id, title, owner_id, created_at 
FROM public.projects 
WHERE owner_id IS NULL;

-- Step 2: Get the first authenticated user to assign ownership
-- (You can change this to a specific user ID if needed)
SELECT 'First user in auth.users:' as status;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at 
LIMIT 1;

-- Step 3: OPTION A - Assign ownership to the first user (RECOMMENDED)
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from step 2
-- UPDATE public.projects 
-- SET owner_id = 'YOUR_USER_ID_HERE'
-- WHERE owner_id IS NULL;

-- Step 3: OPTION B - Delete projects with no owner (if you don't need them)
-- DELETE FROM public.projects WHERE owner_id IS NULL;

-- Step 4: Verify the fix
SELECT 'After fix - all projects should have owner_id:' as status;
SELECT id, title, owner_id, created_at 
FROM public.projects 
ORDER BY created_at DESC;

-- Step 5: Test RLS is working
SELECT 'Testing RLS - this should only show your projects:' as status;
-- This will only return projects owned by the current authenticated user
SELECT * FROM public.projects;
