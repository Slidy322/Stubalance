# 🔐 Setting Up Authentication for Stu-Balance

Your Stu-Balance app is ready, but you need to configure Supabase to enable login functionality!

---

## 📋 Quick Setup (5 minutes)

### Step 1: Create a Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up (it's **FREE!**)
4. Click **"New project"**

### Step 2: Create a New Project

1. Choose an **Organization** (or create one)
2. **Project Name**: `stu-balance` (or any name you like)
3. **Database Password**: Create a strong password (save it!)
4. **Region**: Choose closest to you
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes for setup to complete

### Step 3: Get Your Credentials

1. In your Supabase Dashboard, go to **"Project Settings"** (⚙️ gear icon)
2. Click **"API"** in the left sidebar
3. You'll see:

#### 🌐 Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### 🔑 Project API Keys
- **`anon` `public`** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 4: Add Credentials to Your Project

Open the **`.env`** file in your project root and replace the placeholders:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:** 
- Use your **actual** Project URL (must start with `https://`)
- Use your **actual** Anon/Public key
- Don't use quotes around the values
- Don't add spaces

### Step 5: Restart Your App

After saving the `.env` file:

```bash
# Stop the app (Ctrl+C)
# Then restart it
npm run dev
```

---

## ✅ You're Done!

Now when you open the app:
- ✅ Login page appears first
- ✅ You can **Sign Up** with email/password
- ✅ You can **Sign In** to existing accounts
- ✅ Tasks sync to the cloud
- ✅ Access from any device
- ✅ Secure authentication

---

## 🚀 For Vercel Deployment

If deploying to Vercel:

1. Go to your **Vercel Project Dashboard**
2. Click **"Settings"** → **"Environment Variables"**
3. Add these 2 variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Anon/Public Key |

4. Click **"Save"**
5. **Redeploy** your app

---

## 🆘 Troubleshooting

### ❌ "Authentication Not Configured"
- Make sure `.env` file exists in project root
- Check that values are copied correctly (no typos!)
- Restart the dev server

### ❌ "Invalid API key"
- Double-check you copied the **anon/public** key (not service_role!)
- Make sure there are no extra spaces
- Verify the URL starts with `https://`

### ❌ "Failed to fetch"
- Check your internet connection
- Verify the Supabase project is active
- Try refreshing the Supabase dashboard

---

## 📧 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

---

## 🎉 Features After Setup

Once configured, users can:
- 📝 Sign up with email/password
- 🔐 Secure login system
- ☁️ Cloud sync across devices
- 💾 Automatic data backup
- 🔄 Real-time updates
- 👤 User profiles

Enjoy your fully-functional Stu-Balance app! 💪✨
