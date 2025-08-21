# User Tracking & OAuth Signup Flow Setup

This guide explains how to set up user tracking and OAuth authentication in Notefluence.

## Overview

The application now includes:
- **User Profile Management**: Track user profiles in Supabase
- **OAuth Authentication**: Google and GitHub sign-in
- **Onboarding Flow**: New user setup process
- **Profile Management**: User can update their profile and preferences

## Database Setup

### 1. Run the Migration

Execute the SQL migration to create the users table:

```sql
-- Run this in your Supabase SQL editor
-- File: supabase/migrations/001_create_users_table.sql
```

This creates:
- `users` table with user profile data
- Row Level Security (RLS) policies
- Triggers for automatic profile creation/updates
- Indexes for performance

### 2. Verify the Setup

Check that the following are created in Supabase:
- ✅ `public.users` table
- ✅ RLS policies for user data access
- ✅ Triggers for automatic profile management
- ✅ Indexes for email and provider lookups

## OAuth Configuration

### 1. Supabase OAuth Setup

In your Supabase dashboard:

1. Go to **Authentication** > **Providers**
2. Configure **Google**:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-domain.com/auth/callback`

3. Configure **GitHub**:
   - Enable GitHub provider
   - Add your GitHub OAuth credentials
   - Set redirect URL: `https://your-domain.com/auth/callback`

### 2. Environment Variables

Ensure your `.env.local` has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Flow

### 1. New User Signup
1. User clicks "Continue with Google/GitHub"
2. OAuth redirect to provider
3. User authorizes the application
4. Redirect back to `/auth/callback`
5. Automatic user profile creation in Supabase
6. Redirect to `/onboarding` for new users
7. User completes profile setup
8. Redirect to main dashboard

### 2. Returning User Signin
1. User clicks "Continue with Google/GitHub"
2. OAuth redirect to provider
3. User authorizes (if needed)
4. Redirect back to `/auth/callback`
5. Fetch existing user profile
6. Redirect directly to main dashboard

### 3. Profile Management
- Users can view their profile in the dashboard
- Edit profile information (name, preferences)
- Update theme and notification settings
- View account details (provider, member since, etc.)

## Features

### User Profile Store
- `useUserProfileStore`: Manages user profile state
- Automatic profile creation for new users
- Profile updates and preferences management
- Integration with auth store

### Onboarding Flow
- Multi-step onboarding for new users
- Profile setup with name and preferences
- Theme and notification configuration
- Skip option for quick setup

### Profile Management
- `UserProfile` component for profile display/editing
- Real-time profile updates
- Preference management
- Avatar display (from OAuth providers)

## Security

### Row Level Security (RLS)
- Users can only access their own profile data
- Automatic profile creation with proper permissions
- Secure profile updates

### OAuth Security
- Secure OAuth flow with proper redirects
- Token management through Supabase
- Automatic session handling

## Testing

### 1. Test New User Flow
1. Sign out completely
2. Click "Continue with Google/GitHub"
3. Complete OAuth flow
4. Verify onboarding appears
5. Complete profile setup
6. Verify redirect to dashboard

### 2. Test Returning User Flow
1. Sign out
2. Sign in with same OAuth provider
3. Verify direct redirect to dashboard
4. Check profile data is loaded

### 3. Test Profile Management
1. Edit profile information
2. Update preferences
3. Verify changes persist
4. Test theme switching

## Troubleshooting

### Common Issues

1. **Profile not created automatically**
   - Check RLS policies are enabled
   - Verify triggers are created
   - Check Supabase logs for errors

2. **OAuth redirect errors**
   - Verify redirect URLs in Supabase
   - Check OAuth provider configuration
   - Ensure environment variables are correct

3. **Profile data not loading**
   - Check user authentication state
   - Verify profile store integration
   - Check network requests in browser dev tools

### Debug Steps

1. Check Supabase logs for database errors
2. Verify OAuth provider configuration
3. Test with browser dev tools network tab
4. Check console for JavaScript errors
5. Verify environment variables are loaded

## Next Steps

### Potential Enhancements
- Email verification flow
- Password-based authentication
- Social profile linking
- Advanced user preferences
- User activity tracking
- Team/workspace management

### Integration Points
- Connect user profiles to projects
- Add user-specific project templates
- Implement user activity feeds
- Add collaboration features
- User analytics and insights
