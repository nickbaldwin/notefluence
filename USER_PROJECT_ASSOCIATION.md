# User-Project Association Guide

This guide explains how users are associated with projects in Notefluence.

## How User-Project Association Works

### 1. Database Structure

Each project in the `projects` table has an `owner_id` field that references the user who created it:

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### 2. Project Creation Process

When a user creates a project:

1. **Authentication Check**: The system verifies the user is authenticated
2. **User ID Retrieval**: Gets the current user's ID from Supabase Auth
3. **Project Creation**: Creates the project with `owner_id` set to the user's ID
4. **RLS Enforcement**: Row Level Security ensures only the owner can access it

```typescript
// In projectStore.ts
createProject: async (projectData) => {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Create project with owner_id
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      title: projectData.title,
      description: projectData.description,
      slug: projectData.title.toLowerCase().replace(/\s+/g, '-'),
      is_public: projectData.isPublic || false,
      owner_id: user.id  // ← This links the project to the user
    }])
    .select()
    .single();
}
```

### 3. Row Level Security (RLS)

RLS policies ensure users can only access their own projects:

```sql
-- Users can view their own projects
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can create projects
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);
```

### 4. Project Fetching

When fetching projects, RLS automatically filters by the current user:

```typescript
// In projectStore.ts
fetchProjects: async () => {
  // RLS automatically filters by user - no need to specify owner_id
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      pages_count:pages(count),
      activities_count:activities(count)
    `)
    .order('created_at', { ascending: false });
}
```

### 5. Public Projects

Users can also view public projects (projects where `is_public = true`):

```sql
-- Users can view public projects
CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (is_public = true);
```

## User Flow

### New User Signup
1. User signs up via OAuth (Google/GitHub)
2. User profile is created in `users` table
3. User can create projects (automatically linked to their ID)

### Project Creation
1. User clicks "Create New Project"
2. System checks authentication
3. Project is created with `owner_id = user.id`
4. User is redirected to the new project

### Project Access
1. User visits dashboard
2. System fetches only their projects (via RLS)
3. User can view, edit, and delete their projects

## Security Features

### 1. Automatic Filtering
- RLS automatically filters projects by user
- No need to manually check ownership in application code
- Prevents unauthorized access at the database level

### 2. Cascade Deletion
- When a user is deleted, all their projects are automatically deleted
- Foreign key constraint: `ON DELETE CASCADE`

### 3. Authentication Required
- All project operations require authentication
- Unauthenticated users cannot create or access projects

### 4. Public/Private Control
- Users can make projects public for sharing
- Private projects are only visible to the owner

## Database Relationships

```
auth.users (1) ←→ (N) public.projects
     ↑                    ↑
     id              owner_id
```

- One user can have many projects
- Each project belongs to exactly one user
- Projects are automatically deleted when the user is deleted

## Testing User-Project Association

### Test 1: Create Project
1. Sign in with User A
2. Create a new project
3. Check database: project should have `owner_id = User A's ID`

### Test 2: Access Control
1. Sign in with User A
2. Create a project
3. Sign out
4. Sign in with User B
5. User B should not see User A's project (unless it's public)

### Test 3: Project Ownership
1. Sign in with User A
2. Create a project
3. Try to edit/delete the project
4. Should work (User A owns it)
5. Sign in with User B
6. Try to edit/delete User A's project
7. Should fail (User B doesn't own it)

## Troubleshooting

### Issue: Projects not showing up
- Check if user is authenticated
- Verify RLS policies are enabled
- Check if `owner_id` is set correctly

### Issue: Can't create projects
- Verify user authentication
- Check if `owner_id` is being set
- Ensure RLS policies allow INSERT

### Issue: Can't access own projects
- Check RLS policies
- Verify `auth.uid()` matches `owner_id`
- Ensure user is properly authenticated

## Migration Notes

If you have existing projects without `owner_id`:

1. Run the migration to handle existing projects
2. Existing projects will be marked as public
3. New projects will require `owner_id`

This ensures data integrity while maintaining access to existing content.
