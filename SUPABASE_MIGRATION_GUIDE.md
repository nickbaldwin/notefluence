# Supabase Migration Guide

This guide will help you set up the user tracking system in Supabase step by step.

## Step 1: Run the Users Table Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Copy and paste the contents of `supabase/migrations/001_create_users_table.sql`
5. Click **"Run"**

This creates:
- ✅ `public.users` table
- ✅ Row Level Security (RLS) policies
- ✅ Database functions for user management
- ✅ Performance indexes

## Step 2: Run the Auth Triggers Migration

1. In the same SQL Editor, click **"New query"** again
2. Copy and paste the contents of `supabase/migrations/002_create_auth_triggers.sql`
3. Click **"Run"**

This creates:
- ✅ `on_auth_user_created` trigger
- ✅ `on_auth_user_updated` trigger

## Step 3: Run the Projects RLS Migration

1. Click **"New query"** again
2. Copy and paste the contents of `supabase/migrations/003_setup_projects_rls.sql`
3. Click **"Run"**

This creates:
- ✅ Row Level Security policies for projects
- ✅ User access controls
- ✅ Performance indexes

**Note**: If you get an error saying policies already exist, that's fine! It means your projects table already has the proper security setup. The migration will safely drop and recreate the policies.

## Step 4: Run the Projects Migration

1. Click **"New query"** again
2. Copy and paste the contents of `supabase/migrations/004_migrate_existing_projects.sql`
3. Click **"Run"**

This handles:
- ✅ Existing projects without owner_id
- ✅ Database constraints
- ✅ Foreign key relationships

## Step 5: Verify the Setup

### Check the Users Table
1. Go to **Table Editor**
2. Look for the **"users"** table in the `public` schema
3. Click on it to see the structure

### Check RLS Policies
1. In the **Table Editor**, click on the **"users"** table
2. Look for the **"RLS"** column - it should show **"Enabled"**
3. Click on the **"Policies"** tab to see the security policies

### Check Functions
1. Go to **Database** → **Functions**
2. You should see:
   - `handle_new_user()` function
   - `handle_user_update()` function

### Check Triggers
1. Go to **Database** → **Triggers**
2. You should see:
   - `on_auth_user_created` trigger
   - `on_auth_user_updated` trigger

## Alternative: Manual Setup (If Triggers Don't Work)

If the triggers don't work due to permissions, you can use the application-level approach:

### 1. Skip the Triggers Migration
- Don't run `002_create_auth_triggers.sql`
- The application will handle user profile creation automatically

### 2. The Application Will Handle It
- When users sign in, the `useUserProfileStore` will automatically create profiles
- This happens in the `fetchProfile` function when it detects a missing profile

## Troubleshooting

### If you get permission errors:
1. **"Permission denied"** - This is normal for auth triggers
2. **"Function not found"** - Make sure you ran the first migration first
3. **"Table already exists"** - This is fine, the migration uses `IF NOT EXISTS`

### If triggers don't appear:
1. Check if you have the correct permissions in your Supabase project
2. Try running the migrations in smaller chunks
3. Use the application-level approach instead

### If the application still doesn't work:
1. Check your environment variables in `.env.local`
2. Make sure your Supabase URL and keys are correct
3. Restart your development server

## Testing the Setup

### Test New User Flow:
1. Sign out completely
2. Click "Continue with Google/GitHub"
3. Complete OAuth flow
4. Check if a user profile was created in the `users` table

### Test Returning User Flow:
1. Sign in with the same OAuth provider
2. Check if the existing profile is loaded

## What Each Migration Does

### Migration 001: Users Table
```sql
-- Creates the users table with OAuth data
-- Sets up Row Level Security
-- Creates functions for user management
-- Adds performance indexes
```

### Migration 002: Auth Triggers
```sql
-- Creates triggers on auth.users table
-- Automatically creates user profiles on signup
-- Updates user profiles on auth changes
```

## Next Steps

After running the migrations:
1. Configure OAuth providers in Supabase
2. Update your environment variables
3. Test the authentication flow
4. Set up the onboarding process

The user tracking system will now be fully functional!
