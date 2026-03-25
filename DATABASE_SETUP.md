# Database Setup Guide for Cloud Sync

## Overview

Stu-Balance now supports **cloud synchronization** across devices! Your tasks and profile data are automatically synced when you're logged in, allowing you to access your data from any device.

## 🚀 Quick Setup (5 minutes)

### Step 1: Set Up Supabase Authentication

Follow the instructions in `AUTH_SETUP.md` to:
1. Create a Supabase project
2. Get your Project URL and API keys
3. Configure environment variables

### Step 2: Create Database Tables

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase_migration.sql` file
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

✅ You should see "Success. No rows returned" - this is correct!

### Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor**
2. You should see these new tables:
   - ✅ **tasks** - Stores all user tasks
   - ✅ **user_profiles** - Stores user profile information
   - ✅ **focus_sessions** - Tracks focus/study sessions (optional)

### Step 4: Test the Sync

1. Log in to your account in Stu-Balance
2. Add a task in the Task Sorter
3. Refresh the page - your task should still be there
4. Open Stu-Balance on another device (or another browser)
5. Log in with the same account
6. Your tasks should automatically appear! 🎉

## 📊 What Gets Synced?

### ✅ Synced Across Devices (Cloud Storage)
- **Tasks**: All tasks with due dates, times, subjects, and difficulty
- **Task Status**: Completed, in-progress, or pending
- **Priority Scores**: Calculated urgency levels
- **User Profile**: Name, grade level, school, email

### 📱 Local Only (No Sync)
- **Focus Mode Settings**: Timer preferences
- **UI Preferences**: Collapsed sections, view modes
- **Temporary States**: Current timer, session data

## 🔄 How Sync Works

### Automatic Sync
- **On Login**: Automatically loads all your data from the cloud
- **On Save**: Every time you create/edit/delete a task, it syncs immediately
- **Profile Updates**: Profile changes sync as you type (auto-save)

### Offline Mode
- Works offline! Changes save locally
- When you go back online, data syncs automatically
- LocalStorage serves as a backup for offline access

### Conflict Resolution
- **Cloud is the source of truth** when logged in
- Offline changes merge with cloud data when reconnected
- No data loss - local backup is always maintained

## 🔒 Security & Privacy

### Row Level Security (RLS)
All tables have RLS enabled, which means:
- ✅ Users can only see their own data
- ✅ Users can only edit their own data
- ✅ No user can access another user's tasks or profile
- ✅ Automatic protection via Supabase Auth

### Data Isolation
Each user's data is completely isolated:
```sql
WHERE user_id = auth.uid()
```
This ensures your tasks are private and secure.

## 🛠️ Troubleshooting

### "Error fetching tasks" in Console
**Problem**: Database tables don't exist or RLS policies are blocking access

**Solution**:
1. Make sure you ran the migration SQL (Step 2)
2. Check Table Editor to confirm tables exist
3. Verify RLS policies are enabled in Table Settings

### Tasks Not Syncing
**Problem**: Changes aren't appearing on other devices

**Solution**:
1. Check browser console for errors
2. Verify you're logged in (check Profile page)
3. Confirm internet connection is active
4. Try logging out and back in to force a full sync

### "No rows returned" Error
**Problem**: Can't load existing tasks

**Solution**:
1. Check if RLS policies are enabled (they should be)
2. Verify you're logged in with the correct account
3. Try adding a new task to test write permissions

### Profile Not Saving
**Problem**: Profile changes don't persist

**Solution**:
1. Check if `user_profiles` table exists
2. Verify RLS policies on the table
3. Make sure you're logged in
4. Check browser console for error messages

## 📦 Database Schema

### Tasks Table
```sql
id              UUID (Primary Key)
user_id         UUID (References auth.users)
task_name       TEXT
subject         TEXT
due_date        DATE
due_time        TIME
difficulty      INTEGER (1-10)
status          TEXT (pending/in-progress/completed)
priority_score  REAL
urgency_level   TEXT (Low/Medium/High/Critical)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### User Profiles Table
```sql
id              UUID (Primary Key)
user_id         UUID (References auth.users, Unique)
name            TEXT
grade_level     TEXT
school          TEXT
email           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🎯 Benefits of Cloud Sync

### For Students
- ✅ Access tasks from school, home, or mobile
- ✅ Never lose your task list
- ✅ Automatic backup of all data
- ✅ Share account access across devices

### For Developers (You!)
- ✅ Real-time data synchronization
- ✅ Built-in authentication and security
- ✅ Scalable database infrastructure
- ✅ Free tier available (Supabase)

## 🔮 Future Enhancements

Possible features to add:
- [ ] Real-time collaboration with classmates
- [ ] Task sharing with study groups
- [ ] Calendar integration (Google Calendar, etc.)
- [ ] Push notifications for due dates
- [ ] Analytics and productivity insights
- [ ] Export tasks to CSV/PDF

## 💡 Tips

1. **Always log in** to take advantage of cloud sync
2. **Guest mode still works** - perfect for trying the app
3. **Local backup** - Data is cached locally for offline access
4. **Multiple devices** - Use the same account on phone, tablet, and computer
5. **Secure** - Your data is encrypted and private

## 📝 Migration SQL Location

The complete database migration is in: `supabase_migration.sql`

This file contains:
- Table definitions
- Row Level Security policies
- Indexes for performance
- Auto-update triggers
- UUID generation setup

## Need Help?

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 🔐 See `AUTH_SETUP.md` for authentication setup
- 🔍 Check browser console for error messages
- 💬 Review RLS policies in Supabase dashboard

---

**Ready to sync?** Follow the 3 steps above and start using Stu-Balance across all your devices! 🚀
