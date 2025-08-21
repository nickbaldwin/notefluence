# Notefluence Deployment Checklist

## **Pre-Deployment Checklist**

### **✅ Database Setup**
- [ ] Supabase project is ready
- [ ] All migrations have been run (001-006)
- [ ] RLS policies are in place
- [ ] OAuth providers are configured
- [ ] Database backup created (recommended)

### **✅ Environment Variables**
- [ ] `client/.env.local` exists with Supabase credentials
- [ ] Same credentials will be used for production
- [ ] OAuth redirect URLs include both localhost and production domain

### **✅ Code Preparation**
- [ ] All code is committed to Git
- [ ] Repository is pushed to GitHub
- [ ] Build passes locally (`npm run build` in client directory)
- [ ] No TypeScript errors
- [ ] No missing dependencies
- [ ] Client-side Supabase integration is working

## **Deployment Steps**

### **1. Deploy to Vercel**
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Set root directory to `client`
- [ ] Configure environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] Deploy!

### **2. Configure OAuth (if not done already)**
- [ ] Go to your Supabase project
- [ ] Navigate to Authentication > Providers
- [ ] Add production redirect URL: `https://your-domain.vercel.app/auth/callback`
- [ ] Keep development URL: `http://localhost:3000/auth/callback`

### **3. Test Production**
- [ ] Visit your deployed site
- [ ] Test authentication (sign in/out)
- [ ] Test project creation
- [ ] Test project viewing
- [ ] Test all main features

## **Post-Deployment**

### **✅ Monitoring Setup**
- [ ] Check Vercel deployment logs
- [ ] Monitor Supabase dashboard for errors
- [ ] Test authentication flow
- [ ] Verify data persistence

### **✅ Security Check**
- [ ] RLS policies are working
- [ ] Users can only access their own data
- [ ] OAuth is working correctly
- [ ] No sensitive data in logs

## **Current Architecture**

### **✅ What's Deployed:**
- **Next.js App** on Vercel
- **Client-side Supabase integration** (no separate backend)
- **Single Supabase database** for both dev and prod
- **OAuth authentication** via Supabase

### **🔧 No Separate Backend:**
- No Express server to deploy
- No Railway deployment needed
- All operations happen client-side with Supabase

## **Troubleshooting**

### **Common Issues**

**Build Fails:**
- Check for TypeScript errors
- Verify all dependencies are installed
- Check environment variables

**Authentication Issues:**
- Verify OAuth redirect URLs
- Check Supabase environment variables
- Ensure OAuth providers are configured

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure migrations are applied

**CORS Errors:**
- Check Supabase CORS settings
- Verify domain configuration

**Project Creation Fails:**
- Check browser console for errors
- Verify user is authenticated
- Check RLS policies are working

## **Important Notes**

### **Single Database Approach**
- ⚠️ **Be careful with destructive operations**
- ⚠️ **Always backup before major changes**
- ⚠️ **Test migrations carefully**
- ⚠️ **Use soft deletes where possible**

### **Client-Side Architecture**
- ✅ **No server-side authentication issues**
- ✅ **Direct Supabase integration**
- ✅ **Simpler deployment**
- ⚠️ **All operations happen in browser**

### **Development Best Practices**
- Use transactions for complex operations
- Test with SELECT before UPDATE/DELETE
- Monitor database usage
- Regular cleanup of old data

## **Next Steps After Deployment**

1. **Set up monitoring** (Sentry, etc.)
2. **Configure custom domain** (optional)
3. **Set up CI/CD pipeline**
4. **Add error tracking**
5. **Plan for database separation** when you scale

## **Useful Commands**

```bash
# Test build locally
cd client && npm run build

# Check environment variables
cat client/.env.local

# Test deployment setup
./setup-deployment.sh

# Backup database (in Supabase dashboard)
# Settings > Database > Download backup
```

## **Migration Status**

### **✅ Completed Migrations:**
- [ ] 001_create_users_table.sql
- [ ] 002_create_auth_triggers.sql
- [ ] 003_setup_projects_rls.sql
- [ ] 004_migrate_existing_projects.sql
- [ ] 005_add_public_projects_policy.sql
- [ ] 006_create_example_projects.sql

### **🔧 If Migrations Not Run:**
- Go to Supabase Dashboard > SQL Editor
- Run each migration in order
- Check for any errors

## **Support**

If you encounter issues:
1. Check the deployment logs in Vercel
2. Check Supabase dashboard for errors
3. Review the `DEPLOYMENT_GUIDE.md` for detailed instructions
4. Check browser console for client-side errors
5. Verify all migrations have been run
