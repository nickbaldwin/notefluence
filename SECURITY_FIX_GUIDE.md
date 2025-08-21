# Security Fix: Users Seeing Other Users' Projects

## **Critical Security Issue**

You've discovered that users can see projects created by other users. This is a serious security breach that needs immediate attention.

## **Root Cause Analysis**

The issue is likely one of these:

1. **RLS (Row Level Security) not working properly**
2. **Frontend caching old data**
3. **Authentication state not clearing properly**
4. **RLS policies not applied correctly**

## **Immediate Fix Steps**

### **Step 1: Run the Diagnostic Script**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix_rls_security.sql`
4. Run the script
5. Check the output to see:
   - If RLS is enabled
   - What policies exist
   - If there are projects without owner_id

### **Step 2: Clear Frontend Cache**

**In your browser:**
1. Open Developer Tools (F12)
2. Go to **Application** tab
3. Clear all storage:
   - Local Storage
   - Session Storage
   - IndexedDB
   - Cookies

**Or use this command in the browser console:**
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();
// Clear Supabase cache
window.supabase?.rest?.clearCache?.();
```

### **Step 3: Force Re-authentication**

1. **Sign out completely** from your application
2. **Close all browser tabs** with your app
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. **Sign in again** with a different user

### **Step 4: Test the Fix**

1. **Sign in as User A**
2. **Create a project**
3. **Sign out completely**
4. **Sign in as User B**
5. **Verify User B cannot see User A's project**

## **If the Issue Persists**

### **Option A: Strict RLS (Recommended)**

Run this SQL to create strict RLS policies:

```sql
-- Force enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create strict policies (no public projects)
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);
```

### **Option B: Add Frontend Filtering**

Add additional filtering in your frontend code:

```typescript
// In projectStore.ts, modify fetchProjects:
fetchProjects: async () => {
  set({ loading: true, error: null });
  try {
    // Get current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Fetch projects with explicit user filtering
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        pages_count:pages(count),
        activities_count:activities(count)
      `)
      .eq('owner_id', user.id) // Explicit filter
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    set({ projects: data || [], loading: false });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Failed to fetch projects',
      loading: false 
    });
  }
},
```

## **Verification Steps**

### **Test 1: Basic Security**
1. Sign in as User A
2. Create a project
3. Note the project title
4. Sign out completely
5. Sign in as User B
6. Verify User B cannot see User A's project

### **Test 2: Database Level**
Run this SQL to verify RLS is working:

```sql
-- Check what projects exist
SELECT id, title, owner_id, created_at 
FROM public.projects 
ORDER BY created_at DESC;

-- Check current user
SELECT auth.uid() as current_user_id;

-- Test RLS by trying to select all projects
-- This should only return projects owned by the current user
SELECT * FROM public.projects;
```

### **Test 3: API Level**
Test the API directly:

```bash
# Get your Supabase anon key from the dashboard
curl -X GET "https://your-project.supabase.co/rest/v1/projects" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

## **Prevention Measures**

### **1. Regular Security Audits**
- Test with multiple user accounts regularly
- Check RLS policies monthly
- Monitor for unusual data access patterns

### **2. Add Security Logging**
```sql
-- Create a security audit table
CREATE TABLE IF NOT EXISTS security_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log access
CREATE OR REPLACE FUNCTION log_project_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_audit (user_id, action, table_name, record_id)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to projects table
CREATE TRIGGER project_access_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION log_project_access();
```

### **3. Environment Separation**
Consider using separate databases for development and production to prevent accidental data exposure during development.

## **Emergency Response**

If you discover a data breach:

1. **Immediately disable the application**
2. **Audit all data access**
3. **Reset all user sessions**
4. **Notify affected users**
5. **Implement the fixes above**
6. **Test thoroughly before re-enabling**

## **Monitoring**

Add these queries to your monitoring dashboard:

```sql
-- Check for projects without owners
SELECT COUNT(*) FROM public.projects WHERE owner_id IS NULL;

-- Check for users with access to too many projects
SELECT owner_id, COUNT(*) as project_count 
FROM public.projects 
GROUP BY owner_id 
HAVING COUNT(*) > 100;

-- Check recent project access
SELECT * FROM security_audit 
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
```

## **Next Steps**

1. **Run the diagnostic script immediately**
2. **Clear all browser caches**
3. **Test with multiple user accounts**
4. **Implement the strict RLS policies**
5. **Add frontend filtering as backup**
6. **Set up regular security audits**

This security issue needs to be resolved immediately before any sensitive data is exposed.
