# ✅ Quick Setup - You're Almost Done!

Your Supabase credentials are configured! Here are the final steps:

## 📋 What I Just Did

✅ Created `.env` file with your credentials:
- **Supabase URL**: https://knxxnukmvfbjjfzydaqe.supabase.co
- **Anon Key**: Configured ✓

---

## 🚀 NEXT STEPS (Do These Now!)

### Step 1: Restart Your Development Server ⚡

**IMPORTANT**: You MUST restart for the credentials to load!

```bash
# If your server is running, press Ctrl+C to stop it

# Then restart:
npm run dev
# or
pnpm dev
```

### Step 2: Set Up Database Tables 🗄️

You need to create the database tables in Supabase:

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Log in to your account
   - Select your **stu-balance** project (or whatever you named it)

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Run the Migration**
   - Open the file `supabase_migration.sql` in your code editor
   - **Copy ALL the contents** (Ctrl+A, Ctrl+C)
   - **Paste** into Supabase SQL Editor
   - Click **"Run"** (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see: `Success. No rows returned`
   - This is correct! ✅

5. **Check Tables Were Created**
   - Click **"Table Editor"** in left sidebar
   - You should see:
     - ✅ `tasks`
     - ✅ `user_profiles`
     - ✅ `focus_sessions`

### Step 3: Configure Email Authentication 📧

1. **In Supabase Dashboard**, click **"Authentication"** → **"Providers"**
2. Find **"Email"** and make sure it's **enabled** (toggle ON)
3. Click **"Authentication"** → **"Settings"**
4. **For testing**: Turn OFF "Enable email confirmations"
   - This lets you sign up instantly without checking email
   - You can turn it back ON later for production

### Step 4: Test Login & Signup! 🎉

1. **Open your app** (should be running on localhost after restart)
2. **Go to Profile page** (click user icon in Dashboard)
3. **Click "Login"** button (blue, top right)
4. **Click "Don't have an account? Sign Up"**
5. **Create an account**:
   ```
   Name: Your Name
   Email: your@email.com
   Password: choose a password (min 6 characters)
   ```
6. **Click "Sign Up"**

✅ **Success looks like:**
- You get logged in automatically
- Dashboard shows "Synced to cloud" with green dot 🟢
- No errors in browser console (press F12)

### Step 5: Test Data Sync 🔄

1. **Go to Task Sorter** page
2. **Add a task**:
   ```
   Task Name: Test Task
   Subject: Math
   Due Date: Tomorrow
   Difficulty: Easy
   ```
3. **Click "Add Task"**
4. **Verify in Supabase**:
   - Go to Supabase Dashboard → Table Editor → tasks
   - You should see your task! 🎉

5. **Test Multi-Device Sync**:
   - Open an incognito/private window
   - Go to your app
   - Login with same account
   - Your task should appear! 🚀

---

## 🔍 How to Check If It's Working

### ✅ Signs Everything Works:

1. **Dashboard** shows:
   - 🟢 Green dot + "Synced to cloud" when logged in
   - 🟡 Amber dot + "Guest mode" when logged out

2. **Browser Console** (F12 → Console):
   - No red errors
   - You might see: "Supabase client initialized" ✓

3. **Supabase Table Editor**:
   - Tasks appear in `tasks` table
   - Profile appears in `user_profiles` table

4. **Multi-Device Test**:
   - Add task on one browser
   - See it on another browser (same account)

---

## 🐛 Troubleshooting

### Problem: "Invalid API key" or "Auth session missing"

**Solution:**
```bash
# 1. Make sure .env file exists in root directory
ls -la .env  # Should show the file

# 2. Restart dev server (CRUCIAL!)
# Stop with Ctrl+C, then restart:
npm run dev

# 3. Clear browser cache
# Or use incognito mode
```

### Problem: "Error fetching tasks"

**Solution:**
- Make sure you ran the database migration (Step 2)
- Check Supabase Dashboard → Table Editor
- Tables should exist: tasks, user_profiles, focus_sessions

### Problem: Can't sign up

**Solution:**
- Check Supabase Dashboard → Authentication → Providers
- Email should be enabled (toggle ON)
- Disable email confirmation for testing

### Problem: Data not syncing

**Solution:**
- Make sure you're logged in (check Profile page)
- Check browser console for errors (F12)
- Verify tables exist in Supabase
- Try logging out and back in

---

## 📝 Quick Reference

### Your Supabase Project:
- **URL**: https://knxxnukmvfbjjfzydaqe.supabase.co
- **Dashboard**: https://app.supabase.com/project/knxxnukmvfbjjfzydaqe

### Important Files:
- `.env` - Your credentials (already created ✅)
- `supabase_migration.sql` - Run this in Supabase SQL Editor
- `/src/lib/supabase.ts` - Supabase client
- `/src/lib/AuthContext.tsx` - Authentication logic

### App Features:
- **Login**: Profile page → Login button (blue)
- **Logout**: Profile page → Logout button (red, top right)
- **Sync Status**: Dashboard header (green or amber dot)

---

## 🎯 Success Checklist

Do these in order:

- [ ] ⚡ Restart dev server
- [ ] 🗄️ Run database migration in Supabase SQL Editor
- [ ] ✅ Verify tables exist in Table Editor
- [ ] 📧 Enable Email auth in Supabase
- [ ] 🔓 Disable email confirmation (for testing)
- [ ] 👤 Sign up for an account in your app
- [ ] 🟢 See "Synced to cloud" on Dashboard
- [ ] ➕ Add a test task
- [ ] 👀 See task in Supabase Table Editor
- [ ] 🔄 Test multi-device sync

---

## 🚀 After Everything Works

### For Production (Vercel):

1. **Add environment variables in Vercel**:
   ```
   VITE_SUPABASE_URL = https://knxxnukmvfbjjfzydaqe.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   ```

2. **Configure Redirect URLs**:
   - Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL: `https://your-app.vercel.app/**`

3. **Deploy!**

---

## 🎉 You're Ready!

Once you complete the steps above, you'll have:
- ✅ Email login/signup working
- ✅ Data syncing across devices
- ✅ Secure cloud storage
- ✅ Offline functionality
- ✅ Profile management

**Start with Step 1 (Restart Server) and work through the checklist!** 🚀

---

## Need Help?

- **Browser Console**: Press F12 → Console tab (shows errors)
- **Supabase Logs**: Dashboard → Logs
- **Documentation**: Check `DATABASE_SETUP.md` for details
- **Discord**: https://discord.supabase.com
