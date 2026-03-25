# Stu-Balance Authentication Guide

## Where to Find Authentication Features

### 🔐 Login Page
**URL**: `/login` or click the user icon → Login button in Profile page

The login page allows you to:
- **Sign In** with existing account (email + password)
- **Sign Up** to create a new account (email + password + name)
- Switch between Sign In and Sign Up modes

### 👤 Profile Page Access
**Location**: Dashboard → Click the **User Icon** (circle) in the top-right corner of the header

The user icon appears next to the "STU-BALANCE" title in the header.

### 🚪 Logout Button
**Location**: Profile Page → Top right corner (red button with logout icon)

To logout:
1. Navigate to Profile page (click user icon in Dashboard)
2. Click the red **Logout** button in the top-right corner
3. Confirm logout in the dialog

## Authentication Features

### ✅ Sign Up
- Email and password required
- Optional name field
- Email verification (if enabled in Supabase settings)
- Automatic login after successful sign up

### ✅ Sign In
- Email and password authentication
- Session persistence (stays logged in after page refresh)
- Secure token-based authentication via Supabase

### ✅ Sign Out
- Available in Profile page (top-right red button)
- Clears all session data
- Redirects to login page

### ✅ Session Management
- Automatic session detection on app load
- Persistent login across page refreshes
- Secure session handling via Supabase Auth

## User Experience Flow

### New User Journey
1. Open Stu-Balance app
2. Click **User Icon** in Dashboard header
3. Click **Login** button (blue) in Profile page header
4. Toggle to **"Don't have an account? Sign Up"**
5. Enter name, email, and password
6. Click **Sign Up**
7. (Optional) Verify email if enabled
8. Start using Stu-Balance!

### Returning User Journey
1. Navigate to `/login` or click Login from Profile
2. Enter email and password
3. Click **Sign In**
4. Redirected to Dashboard
5. Continue managing tasks!

### Logout Journey
1. Click **User Icon** in Dashboard
2. See your email displayed under "Profile"
3. Click the red **Logout** button (top-right)
4. Confirm logout
5. Redirected to login page

## Visual Indicators

### Logged In
- Profile page shows: **"Logged in as [your-email]"**
- Profile page has **red Logout button** (top-right)
- Email field auto-populated from auth

### Logged Out (Guest)
- Profile page shows: **"Your information"**
- Profile page has **blue Login button** (top-right)
- All features still accessible (guest mode)

## Guest Access

**Good news!** You can use Stu-Balance without logging in!

All features work in guest mode:
- ✅ Dashboard and task management
- ✅ Focus Mode with Pomodoro timer
- ✅ Task Sorter for priority scheduling
- ✅ My Task calendar view
- ✅ Profile information (stored locally)

**Login benefits:**
- Sync data across devices (requires backend setup)
- Secure account with password
- Cloud backup of tasks (requires backend integration)

## Setup Required

To enable authentication, you need to:
1. Set up a Supabase project
2. Configure environment variables
3. See `AUTH_SETUP.md` for detailed instructions

## Troubleshooting

### Can't Find Login Page?
- **Option 1**: Navigate directly to `/login` in your browser
- **Option 2**: Dashboard → User Icon → Profile → Login Button (top-right, blue)

### Can't Find Logout Button?
- Go to Profile page (click User Icon in Dashboard)
- Look for the **red circular button** with logout icon in the **top-right corner**
- Next to the "Profile" heading

### Not Redirecting After Login?
- Check browser console for errors
- Verify Supabase credentials in `.env` file
- Make sure Supabase project is active

### Email Not Receiving Confirmation?
- Check spam folder
- Verify email settings in Supabase dashboard
- For development, disable email confirmation in Supabase settings

## Need Help?

Refer to:
- `AUTH_SETUP.md` - Complete Supabase setup guide
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- Check browser console for error messages
