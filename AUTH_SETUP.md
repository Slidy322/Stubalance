# Authentication Setup Guide

## Setting up Supabase Authentication for Stu-Balance

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Stu-Balance (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"

### 2. Get Your Supabase Credentials

1. Once your project is created, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the left sidebar
3. You'll find two important values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon public key**: This is your `VITE_SUPABASE_ANON_KEY`

### 3. Configure Your Environment Variables

1. Create a `.env` file in the root of your project (same level as package.json)
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 4. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings:
   - For development, you can use the default settings
   - For production, configure your own email service (SendGrid, AWS SES, etc.)

### 5. Optional: Disable Email Confirmation for Development

If you want to test without email confirmation:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Disable** "Enable email confirmations"

⚠️ **Note**: For production, always enable email confirmations for security!

### 6. Test Your Authentication

1. Start your development server: `npm run dev` or `pnpm dev`
2. Navigate to `/login`
3. Try signing up with a test email and password
4. If email confirmation is enabled, check your inbox for the confirmation email

## Features Included

✅ **Email/Password Sign Up**
- Users can create accounts with email and password
- Optional user metadata (name)

✅ **Email/Password Sign In**
- Secure login with Supabase authentication

✅ **Session Management**
- Automatic session persistence
- Session refresh on app reload

✅ **Logout Functionality**
- Available in the Profile page
- Clears user session completely

✅ **Protected Routes** (Optional)
- You can add route protection to require login for certain pages
- Current setup allows guest access to all features

## Troubleshooting

### "Invalid API key" Error
- Double-check your `.env` file has the correct credentials
- Make sure you're using the **anon public key**, not the service role key
- Restart your development server after changing `.env`

### Email Not Sending
- Check Supabase dashboard → Authentication → Settings
- Verify email provider is configured
- For development, consider disabling email confirmation

### User Not Persisting After Page Refresh
- This is normal if you haven't set up proper session management
- Make sure `AuthProvider` is wrapping your app in `App.tsx`

## Security Best Practices

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Don't hardcode credentials
3. **Enable RLS (Row Level Security)** in Supabase for database tables
4. **Enable email confirmation** in production
5. **Use strong password requirements** for users

## Next Steps

Want to add more authentication features? Consider:
- Social login (Google, GitHub, etc.)
- Password reset functionality
- Email verification
- Two-factor authentication
- User profile pictures with Supabase Storage

For more information, visit the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
