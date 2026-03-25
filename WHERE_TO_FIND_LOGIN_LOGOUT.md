# 🔐 Where to Find Profile, Login & Logout

## 📍 Quick Navigation Map

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD PAGE                        │
│  ┌────────────────────────────────────────────┐         │
│  │                              [👤 Profile] ← Click!   │
│  │         STU-BALANCE                         │         │
│  │    Smart Workload Manager                  │         │
│  │   🟢 Synced to cloud / 🟡 Guest mode       │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌──────────┐  ┌──────────┐                            │
│  │  Focus   │  │ Schedule │                            │
│  └──────────┘  └──────────┘                            │
│  ┌─────────────────────────┐                            │
│  │      My Task           │                            │
│  └─────────────────────────┘                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Guide

### **Finding the Profile Page**

#### **Method 1: From Dashboard (Easiest)**
1. ✅ Open your app
2. ✅ Look at the **top right corner** of the Dashboard
3. ✅ You'll see a button with a **user icon** 👤 and text "**Profile**"
4. ✅ **Click it!**

#### **Method 2: Direct URL**
- Just type in your browser: `http://localhost:5173/profile`
- Or whatever your app URL is + `/profile`

---

## 🔓 How to Login

### **If You're NOT Logged In:**

1. **Go to Dashboard** (your home page)
2. **Click "Profile"** button (top right)
3. On the Profile page, look for:
   - **Blue "Login" button** (top right corner)
   - OR a message saying "Guest Mode - Click to Login"
4. **Click the Login button**
5. You'll see the **Login Page** with:
   - Email field
   - Password field
   - "Sign In" button
   - "Don't have an account? Sign Up" link

### **Login Form Looks Like:**

```
┌──────────────────────────────────┐
│         Welcome Back!            │
│                                  │
│  Email: [________________]       │
│                                  │
│  Password: [________________]    │
│                                  │
│      [     Sign In      ]        │
│                                  │
│  Don't have an account? Sign Up  │ ← Click to create account
└──────────────────────────────────┘
```

---

## 📝 How to Sign Up (Create Account)

1. **Go to Login page** (see above)
2. **Click "Don't have an account? Sign Up"** at the bottom
3. Fill in the **Sign Up Form**:
   ```
   Name: Your Name
   Email: your@email.com
   Password: your-password (min 6 characters)
   ```
4. **Click "Sign Up"**
5. ✅ You'll be automatically logged in!
6. ✅ You'll see "Synced to cloud" 🟢 on Dashboard

---

## 🚪 How to Logout

### **Method 1: From Profile Page (Main Method)**

1. **Click "Profile"** button on Dashboard (top right)
2. On the Profile page, look at the **top right corner**
3. You'll see a **red circle button** with a logout icon 🚪
4. **Click it**
5. Confirm "Are you sure you want to log out?"
6. ✅ You're logged out!

### **Visual Guide:**

```
┌─────────────────────────────────────────────────┐
│  PROFILE PAGE                          [🚪] ← Logout (RED)
│  ┌───────────────────────────────────────────┐  │
│  │         📔 My Profile                     │  │
│  │                                           │  │
│  │  Name: [Your Name_____________]           │  │
│  │  Grade: [10th Grade___________]           │  │
│  │  School: [Your School_________]           │  │
│  │  Email: [your@email.com_______]           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Visual Button Guide

### **Profile Button (Dashboard)**
```
┌──────────────────────┐
│  👤  Profile         │ ← White/pink rounded button
└──────────────────────┘    Top right of Dashboard
```

### **Login Button (Profile Page)**
```
┌──────────────────────┐
│  🔓  Login           │ ← Blue rounded button
└──────────────────────┘    Top right of Profile page
                            (Only shows when NOT logged in)
```

### **Logout Button (Profile Page)**
```
┌───────┐
│  🚪   │ ← Red circle button
└───────┘    Top right of Profile page
            (Only shows when logged in)
```

---

## 📱 All Pages & Their URLs

| Page | URL | How to Get There |
|------|-----|------------------|
| **Dashboard** | `/` | Default home page |
| **Profile** | `/profile` | Click "Profile" button on Dashboard |
| **Login** | `/login` | Click "Login" on Profile OR direct URL |
| **Focus Mode** | `/focus` | Click "Focus" card on Dashboard |
| **Task Sorter** | `/task-sorter` | Click "Schedule" card on Dashboard |
| **My Task** | `/my-task` | Click "My Task" card on Dashboard |

---

## 🔍 How to Know If You're Logged In

### ✅ **Logged In Signs:**

1. **Dashboard header shows:**
   - 🟢 Green pulsing dot
   - "Synced to cloud"

2. **Profile page shows:**
   - 🚪 Red logout button (top right)
   - Your profile information
   - No "Login" button

3. **Browser console shows:**
   - "User logged in: your@email.com" (press F12 to check)

### ❌ **NOT Logged In Signs:**

1. **Dashboard header shows:**
   - 🟡 Amber dot
   - "Guest mode - data stored locally"

2. **Profile page shows:**
   - 🔓 Blue "Login" button (top right)
   - No logout button
   - Empty profile fields (or local data only)

---

## 🎯 Common Workflows

### **First Time User:**
```
1. Open app → Dashboard
2. Click "Profile" (top right)
3. Click "Login" (blue button)
4. Click "Sign Up" link
5. Create account
6. ✅ Logged in automatically!
```

### **Returning User:**
```
1. Open app → Dashboard
2. Click "Profile"
3. Click "Login"
4. Enter email & password
5. Click "Sign In"
6. ✅ Logged in!
```

### **Logout:**
```
1. Click "Profile" on Dashboard
2. Click red logout button (top right)
3. Confirm
4. ✅ Logged out!
```

---

## 🆘 Troubleshooting

### "I can't find the Profile button!"

**Look for:**
- Top right corner of the **Dashboard page**
- A white/pink button with a user icon 👤
- Text says "**Profile**"

**If you still can't find it:**
- Make sure you're on the Dashboard (home page)
- Try refreshing the page (Ctrl+R or Cmd+R)
- Or just type: `http://localhost:5173/profile` in your browser

### "I don't see the Logout button!"

**Check:**
1. Are you on the **Profile page**? (not Dashboard)
2. Are you actually **logged in**?
   - Check Dashboard for "Synced to cloud" 🟢
3. Look at **top right corner** of Profile page
4. Should be a **red circle button**

**If still not there:**
- You might not be logged in
- Try logging in first
- Refresh the page

### "Login button doesn't work"

**Solutions:**
1. **Check your credentials**
   - Email must be valid format
   - Password must be at least 6 characters
2. **Check browser console** (F12)
   - Look for error messages
3. **Make sure .env is configured**
   - Restart dev server after adding credentials
4. **Try signing up** if you don't have an account yet

---

## 📸 Screenshot Guide (What You Should See)

### **Dashboard - Not Logged In**
```
╔═══════════════════════════════════════╗
║              [👤 Profile] ← Button    ║
║                                       ║
║         STU-BALANCE                   ║
║    Smart Workload Manager             ║
║   🟡 Guest mode - data stored locally ║ ← Amber dot
║                                       ║
║  [Focus]  [Schedule]                  ║
║      [My Task]                        ║
╚═══════════════════════════════════════╝
```

### **Dashboard - Logged In**
```
╔═══════════════════════════════════════╗
║              [👤 Profile] ← Button    ║
║                                       ║
║         STU-BALANCE                   ║
║    Smart Workload Manager             ║
║   🟢 Synced to cloud                  ║ ← Green pulsing dot
║                                       ║
║  [Focus]  [Schedule]                  ║
║      [My Task]                        ║
╚═══════════════════════════════════════╝
```

### **Profile Page - Not Logged In**
```
╔═══════════════════════════════════════╗
║                        [🔓 Login]     ║ ← Blue button
║    📔 My Profile                      ║
║                                       ║
║   [Empty fields]                      ║
╚═══════════════════════════════════════╝
```

### **Profile Page - Logged In**
```
╔═══════════════════════════════════════╗
║                           [🚪]        ║ ← Red circle
║    📔 My Profile                      ║
║                                       ║
║   Name: John Doe                      ║
║   Email: john@example.com             ║
╚═══════════════════════════════════════╝
```

---

## 🎓 Pro Tips

1. **Bookmark the Profile page** for quick access
2. **Check the sync status** on Dashboard to know if you're logged in
3. **Use the same browser** for automatic session persistence
4. **Clear browser cache** if you have login issues
5. **Test in incognito** to verify multi-device sync

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] I'm on the Dashboard page
- [ ] I can see the Profile button (top right)
- [ ] I clicked the Profile button
- [ ] I'm now on the Profile page (`/profile` in URL)
- [ ] I can see either Login (blue) or Logout (red) button
- [ ] I understand the difference between logged in/out states

---

**That's it!** The Profile button is now on your Dashboard in the top right corner. Click it to access Profile → Login → Logout features! 🎉
