# Public Projects Setup Guide

## **Overview**

This guide explains how to implement **Option 1: Public Projects** which allows all users to see example projects while maintaining security for private projects.

## **What This Implementation Does**

1. **RLS Policy Enhancement**: Adds a policy that allows viewing any project marked as `is_public = true`
2. **Frontend Updates**: Modifies the project fetching to include both user's own projects AND public projects
3. **Example Projects**: Creates sample projects that are marked as public
4. **Visual Indicators**: Shows public/private status on project cards

## **Security Model**

- **Private Projects**: Users can only see their own private projects
- **Public Projects**: All users can see any project marked as public
- **Own Projects**: Users can see all their own projects (both public and private)

## **Migration Steps**

### **Step 1: Run the Public Projects Policy Migration**

Go to your **Supabase Dashboard → SQL Editor** and run:

```sql
-- Copy and paste the contents of: supabase/migrations/005_add_public_projects_policy.sql
```

This creates the RLS policy that allows viewing public projects.

### **Step 2: Run the Example Projects Migration**

```sql
-- Copy and paste the contents of: supabase/migrations/006_create_example_projects.sql
```

This creates 5 example projects that are marked as public.

## **Verification Steps**

### **1. Check RLS Policies**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'projects' AND schemaname = 'public'
ORDER BY policyname;
```

You should see:
- "Users can view their own projects"
- "Users can view public projects" 
- "Users can create projects"
- "Users can update their own projects"
- "Users can delete their own projects"

### **2. Check Example Projects**
```sql
SELECT id, title, slug, is_public, owner_id, created_at
FROM public.projects
WHERE is_public = true
ORDER BY created_at;
```

You should see 5 example projects marked as public.

### **3. Test with Different Users**

1. **Sign in as User A** - should see their own projects + all public projects
2. **Sign in as User B** - should see their own projects + all public projects
3. **Create a private project** - should only be visible to the creator
4. **Create a public project** - should be visible to all users

## **Frontend Changes Made**

### **1. Project Store (`client/src/stores/projectStore.ts`)**
- Updated `fetchProjects` to use `.or()` query to fetch both own projects and public projects
- Removed the explicit `owner_id` filter since RLS handles this

### **2. Project Card (`client/src/components/Projects/ProjectCard.tsx`)**
- Added visual indicators for public/private status
- Added Globe icon for public projects
- Added Lock icon for private projects
- Improved styling and hover effects

## **Benefits of This Approach**

✅ **Security**: Private projects remain secure  
✅ **User Experience**: All users see helpful examples  
✅ **Scalability**: Easy to add more public projects  
✅ **Flexibility**: Users can choose public/private for their projects  
✅ **Performance**: Efficient queries with proper indexing  

## **Troubleshooting**

### **Issue: Users can't see public projects**
- Check that migration 005 ran successfully
- Verify RLS policies are in place
- Check that projects have `is_public = true`

### **Issue: Users can see other users' private projects**
- Check that the "Users can view their own projects" policy is working
- Verify that private projects have `is_public = false`

### **Issue: Example projects not created**
- Ensure at least one user exists in `auth.users`
- Check that migration 006 ran successfully
- Verify the user ID assignment in the migration

## **Next Steps**

After running these migrations:

1. **Test the functionality** with different user accounts
2. **Customize example projects** as needed for your use case
3. **Consider adding more public projects** for different use cases
4. **Monitor performance** and add indexes if needed

The implementation is now complete and ready for testing!
