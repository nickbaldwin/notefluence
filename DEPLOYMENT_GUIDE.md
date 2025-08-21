# Notefluence Deployment Guide

## **Architecture: Supabase + Vercel (API Routes)**

### **Frontend & Backend (Next.js) → Vercel**
- **Why Vercel**: Perfect for Next.js, automatic deployments, API routes
- **Cost**: Free tier available, scales well
- **Architecture**: Single Next.js app with API routes (no separate backend)

### **Database → Supabase (Single Database for Dev & Prod)**
- **Why Supabase**: Already integrated, real-time features, RLS
- **Cost**: Free tier with generous limits
- **Approach**: Single database shared between development and production

### **Auth → Supabase Auth**
- **Why**: Already implemented, OAuth providers, JWT tokens

## **Current Architecture**

### **✅ What We Have:**
- **Next.js App** with client-side Supabase integration
- **No separate backend** - using client-side Supabase client directly
- **API Routes** available in `client/src/app/api/` (currently not used)
- **Single Supabase database** for both dev and prod

### **🔧 What We Need for Production:**
- **Deploy to Vercel** (Next.js app)
- **Configure OAuth redirect URLs** for production domain
- **Environment variables** in Vercel

## **Single Database Setup (Dev + Prod)**

### **Pros:**
- ✅ **Simpler setup** - Only one database to manage
- ✅ **Always working with real data** - No sync issues
- ✅ **Easier debugging** - Production issues can be reproduced locally
- ✅ **No environment switching** - Same data structure everywhere

### **Cons:**
- ❌ **Risk of affecting production data** - Be careful with destructive operations
- ❌ **Can't easily reset development state** - Need to be mindful of data
- ❌ **Harder to test migrations** - Test carefully before applying

### **Best Practices for Single Database:**
1. **Always backup before major changes**
2. **Test destructive operations on a copy first**
3. **Use soft deletes where possible**
4. **Be careful with migration scripts**
5. **Monitor database usage closely**

## **Deployment Steps**

### **Step 1: Prepare Your Supabase Database**

1. **Ensure your current Supabase project is ready:**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Verify all migrations have been run
   - Check that RLS policies are in place
   - Confirm OAuth providers are configured

2. **Backup your current data (optional but recommended):**
   - Go to **Settings > Database**
   - Click **"Download backup"** to save a copy

### **Step 2: Configure Environment Variables**

**Development Environment (`.env.local`):**
```bash
# Your existing Supabase project (will be used for both dev and prod)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Production Environment (Vercel):**
```bash
# Same Supabase project as development
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **Step 3: Configure OAuth Providers**

**Update OAuth redirect URLs to include production domain:**

1. Go to your Supabase project **Authentication > Providers**
2. Configure Google OAuth with both URLs:
   - **Development**: `http://localhost:3000/auth/callback`
   - **Production**: `https://your-domain.vercel.app/auth/callback`

**Important: Configure Supabase URL Settings**

1. Go to your Supabase project **Authentication > URL Configuration**
2. Set the following:
   - **Default Site URL**: `https://your-domain.vercel.app` (your production URL)
   - **Redirect URLs** (add both):
     ```
     http://localhost:3000/auth/callback
     https://your-domain.vercel.app/auth/callback
     ```

**This configuration allows:**
- ✅ **Development**: Authentication redirects to localhost
- ✅ **Production**: Authentication redirects to production
- ✅ **No manual switching** between environments needed
- ✅ **Automatic environment detection** based on where the user initiates authentication

### **Step 4: Deploy to Vercel**

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository
   - Set root directory to `client`
   - Configure environment variables

3. **Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Enable Automatic Deployments:**
   - In Vercel project settings, ensure GitHub integration is enabled
   - Automatic deployments will trigger on every push to the main branch

### **Step 5: Test Production**

1. **Visit your deployed site**
2. **Test authentication** (sign in/out)
3. **Test project creation**
4. **Test project viewing**
5. **Test all main features**

## **Automatic Deployment Workflow**

### **✅ How It Works:**
1. **Make changes** to your code locally
2. **Commit and push** to GitHub main branch
3. **Vercel automatically detects** the push
4. **Builds and deploys** your changes
5. **Your site is updated** without manual intervention

### **✅ Benefits:**
- **No manual deployment** needed
- **Continuous integration** from GitHub
- **Automatic rollback** if build fails
- **Preview deployments** for pull requests (optional)

## **Current Implementation Details**

### **Client-Side Supabase Integration**

Our current implementation uses the client-side Supabase client directly:

```typescript
// In projectStore.ts
const { data: { user } } = await supabase.auth.getUser();
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .or(`owner_id.eq.${user.id},is_public.eq.true`);
```

### **API Routes (Available but Not Used)**

We have API routes available in `client/src/app/api/` but they're not currently used:

- `client/src/app/api/projects/route.ts` - Available for future use
- These could be used if we need server-side operations

### **Future Considerations**

If you need server-side operations in the future:

1. **Use API Routes** for operations that need server-side context
2. **Add service role key** for operations that bypass RLS
3. **Keep client-side operations** for user-specific data

## **Development Workflow with Single Database**

### **Safe Development Practices**

1. **Use soft deletes:**
   ```sql
   -- Instead of DELETE, use UPDATE
   UPDATE projects SET is_archived = true WHERE id = 'project-id';
   ```

2. **Test destructive operations:**
   ```sql
   -- Always test with SELECT first
   SELECT * FROM projects WHERE id = 'project-id';
   -- Then run the actual operation
   ```

3. **Use transactions for complex operations:**
   ```sql
   BEGIN;
   -- Your operations here
   COMMIT; -- or ROLLBACK if something goes wrong
   ```

4. **Backup before major changes:**
   - Export data before running migrations
   - Test migrations on a copy first

## **Database Management**

### **Migration Strategy**

```bash
# All migrations run on the same database
supabase/migrations/
├── 001_create_users_table.sql
├── 002_create_auth_triggers.sql
├── 003_setup_projects_rls.sql
├── 004_migrate_existing_projects.sql
├── 005_add_public_projects_policy.sql
└── 006_create_example_projects.sql
```

### **Safe Migration Practices**

1. **Always backup before migrations:**
   ```sql
   -- Create a backup table
   CREATE TABLE projects_backup AS SELECT * FROM projects;
   ```

2. **Use reversible migrations:**
   ```sql
   -- Add column with default value
   ALTER TABLE projects ADD COLUMN new_field TEXT DEFAULT 'default_value';
   
   -- Can be reversed with:
   ALTER TABLE projects DROP COLUMN new_field;
   ```

3. **Test migrations on a copy:**
   - Create a copy of your database
   - Test migrations there first
   - Only apply to production when confident

## **Monitoring and Maintenance**

### **Supabase Monitoring**

1. **Database Performance:**
   - Monitor query performance in Supabase Dashboard
   - Check for slow queries
   - Optimize indexes as needed

2. **Authentication:**
   - Monitor auth events
   - Check for failed login attempts
   - Review OAuth provider status

3. **Storage:**
   - Monitor database size
   - Check for unused data
   - Implement cleanup scripts

### **Vercel Monitoring**

1. **Performance:**
   - Monitor Core Web Vitals
   - Check for slow page loads
   - Optimize bundle size

2. **Errors:**
   - Set up error tracking (Sentry)
   - Monitor client-side errors
   - Check for build failures

## **Cost Optimization**

### **Supabase Costs**

**Free Tier Limits:**
- 500MB database
- 50,000 monthly active users
- 2GB bandwidth
- 1GB file storage

**Scaling:**
- Pro plan: $25/month for higher limits
- Pay-as-you-go for additional usage

### **Vercel Costs**

**Free Tier Limits:**
- 100GB bandwidth
- 100GB storage
- 100GB function execution time

**Scaling:**
- Pro plan: $20/month for higher limits
- Enterprise for large scale

## **Security Best Practices**

### **Environment Variables**

1. **Never commit secrets to Git**
2. **Use the same keys for dev/prod** (since single database)
3. **Rotate keys regularly**
4. **Use Vercel's encrypted environment variables**

### **Database Security**

1. **Enable RLS on all tables**
2. **Use parameterized queries**
3. **Limit database access**
4. **Monitor for suspicious activity**

### **Client-Side Security**

1. **Input validation**
2. **Rate limiting (if needed)**
3. **Authentication checks**
4. **Data sanitization**

## **Troubleshooting**

### **Common Issues**

1. **CORS Errors:**
   - Check Supabase CORS settings
   - Verify domain configuration

2. **Authentication Issues:**
   - Check OAuth redirect URLs in Supabase URL Configuration
   - Verify environment variables
   - Check Supabase auth settings
   - Ensure both localhost and production URLs are in Redirect URLs list

3. **OAuth Redirect Issues:**
   - Verify Supabase URL Configuration is correct
   - Check that both localhost and production URLs are in Redirect URLs
   - Ensure Default Site URL is set to production URL
   - Clear browser cache and cookies
   - Check that OAuth providers are properly configured in Supabase

4. **Database Connection:**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure migrations are applied

5. **Build Failures:**
   - Check for missing dependencies
   - Verify TypeScript compilation
   - Check environment variables

### **Debugging Tools**

1. **Supabase Dashboard:**
   - SQL Editor for direct database access
   - Logs for debugging
   - Real-time inspector

2. **Vercel Dashboard:**
   - Function logs
   - Build logs
   - Performance insights

3. **Browser DevTools:**
   - Network tab for API calls
   - Console for errors
   - Application tab for storage

## **Migration to Separate Databases (Future)**

When you're ready to scale and need separate databases:

1. **Create new Supabase projects:**
   - `notefluence-dev` for development
   - `notefluence-prod` for production

2. **Update environment variables:**
   - Development: Point to dev database
   - Production: Point to prod database

3. **Migrate data:**
   - Export production data
   - Import to new production database
   - Set up development database with seed data

4. **Update OAuth:**
   - Configure separate redirect URLs for each environment

## **Next Steps**

1. **Deploy to Vercel** (Next.js app)
2. **Configure OAuth redirect URLs**
3. **Set up monitoring and alerts**
4. **Add error tracking**
5. **Plan for database separation when needed**
