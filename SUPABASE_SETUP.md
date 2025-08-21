# 🚀 Supabase Setup Guide

This guide will help you set up Supabase for your Notefluence application with multi-tenant authentication and Row Level Security (RLS).

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Supabase account (free at https://supabase.com)

## 🗄️ Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Click "New Project"

2. **Configure Project**
   - Choose your organization
   - Enter project name: `notefluence`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll receive an email when ready

## 🗄️ Step 2: Set Up Database Schema

1. **Open SQL Editor**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run Schema Script**
   - Copy the contents of `supabase-schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see: `projects`, `pages`, `activities`

## 🔐 Step 3: Configure Authentication

1. **Enable OAuth Providers**
   - Go to "Authentication" → "Providers"
   - Enable "Google" and "GitHub"

2. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

3. **GitHub OAuth Setup**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create new OAuth App
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## 🔧 Step 4: Configure Environment Variables

1. **Get API Keys**
   - In Supabase dashboard, go to "Settings" → "API"
   - Copy "Project URL" and "anon public" key

2. **Update Environment File**
   ```bash
   # Edit client/.env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 🚀 Step 5: Deploy to Production

### Option A: Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables**
   - In Vercel dashboard, go to your project
   - Go to "Settings" → "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option B: Manual Deployment

1. **Build the Application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Your Hosting Provider**
   - Upload the `.next` folder
   - Set environment variables
   - Configure domain

## 🔒 Step 6: Security Configuration

1. **Update Redirect URLs**
   - In Supabase dashboard, go to "Authentication" → "URL Configuration"
   - Add your production domain to "Site URL"
   - Add `https://your-domain.com/auth/callback` to redirect URLs

2. **Configure CORS (if needed)**
   - In Supabase dashboard, go to "Settings" → "API"
   - Add your domain to "Additional Allowed Origins"

## 🧪 Step 7: Test the Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Visit http://localhost:3000
   - Click "Continue with Google" or "Continue with GitHub"
   - Verify you can sign in and out

3. **Test Project Creation**
   - Sign in to the application
   - Create a new project
   - Verify it appears in your dashboard

4. **Test Multi-tenancy**
   - Sign in with a different account
   - Verify you can't see projects from the first account
   - Create a project and verify it's isolated

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure you're using the "anon public" key, not the service role key

2. **OAuth redirect errors**
   - Verify redirect URLs in both Supabase and OAuth provider settings
   - Check that your domain is added to allowed origins

3. **RLS policies not working**
   - Ensure RLS is enabled on all tables
   - Check that policies are created correctly
   - Verify user authentication is working

4. **Database connection errors**
   - Check your Supabase project status
   - Verify your database password
   - Check network connectivity

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/projects" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"

# Check authentication status
# In browser console:
supabase.auth.getSession()
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Success!

Once you've completed all steps, you'll have:

✅ **Multi-tenant authentication** with OAuth  
✅ **Row Level Security** protecting user data  
✅ **Real-time subscriptions** for live updates  
✅ **Production-ready deployment**  
✅ **Scalable architecture** for growth  

Your Notefluence application is now ready for production use!
