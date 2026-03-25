# 🌐 Cloud Sync - Complete Guide

## What is Cloud Sync?

Cloud Sync allows your Stu-Balance data to be automatically saved to the cloud and synchronized across all your devices. When you log in, your tasks, profile, and settings are accessible from anywhere!

## ✨ Key Features

### 🔄 Automatic Synchronization
- **Real-time sync**: Changes save instantly to the cloud
- **Cross-device**: Access your data from phone, tablet, laptop, or desktop
- **Always up-to-date**: Latest data syncs when you log in
- **Conflict-free**: Smart merging ensures no data loss

### 🔒 Secure & Private
- **User isolation**: Only you can see your data
- **Encrypted transport**: HTTPS encryption for all data transfers
- **Row-level security**: Database-level protection via Supabase RLS
- **OAuth-ready**: Support for social logins (Google, GitHub, etc.)

### 💾 Offline Support
- **Works offline**: Full functionality without internet
- **Local backup**: Data cached in localStorage
- **Auto-sync on reconnect**: Syncs when back online
- **Never lose data**: Dual storage (cloud + local)

## 📊 What Gets Synced?

| Data Type | Synced? | Location |
|-----------|---------|----------|
| **Tasks** | ✅ Yes | Cloud + Local |
| **Task Status** | ✅ Yes | Cloud + Local |
| **Priority Scores** | ✅ Yes | Cloud + Local |
| **User Profile** | ✅ Yes | Cloud + Local |
| **Focus Settings** | ❌ No | Local only |
| **UI Preferences** | ❌ No | Local only |

## 🚀 Quick Start

### Prerequisites
1. ✅ Supabase account ([sign up here](https://supabase.com))
2. ✅ Stu-Balance app installed/deployed
3. ✅ 5 minutes to set up

### Step 1: Supabase Setup
```bash
# 1. Create a Supabase project at https://supabase.com
# 2. Get your credentials from Settings → API
# 3. Create .env file in project root:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Database Setup
1. Open Supabase Dashboard → SQL Editor
2. Run the migration from `supabase_migration.sql`
3. Verify tables created in Table Editor

### Step 3: Test It!
1. Sign up for an account
2. Add some tasks
3. Log in from another device
4. See your tasks appear automatically! 🎉

## 🔍 How It Works

### Architecture
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Device 1  │         │   Supabase   │         │   Device 2  │
│  (Browser)  │◄───────►│   Database   │◄───────►│  (Browser)  │
└─────────────┘         └──────────────┘         └─────────────┘
      ↕                                                  ↕
  localStorage                                      localStorage
```

### Data Flow

**When Logged In:**
```
User Action → Supabase API → Cloud Database
                   ↓
              localStorage (backup)
```

**When Logged Out (Guest Mode):**
```
User Action → localStorage only
```

**On Login:**
```
Authentication → Fetch from Supabase → Display Data
                        ↓
                   Cache in localStorage
```

## 💻 Technical Implementation

### Task Syncing

The `taskStore` automatically handles syncing:

```typescript
// Add task - automatically syncs to cloud if logged in
await taskStore.addTask(newTask);

// Update task - syncs changes immediately
await taskStore.updateTask(taskId, { status: 'completed' });

// Delete task - removes from cloud and local
await taskStore.deleteTask(taskId);

// Get tasks - fetches from cloud or local
const tasks = await taskStore.getAllTasks();
```

### Profile Syncing

Profile data syncs on every change:

```typescript
// Auto-saves to cloud when user types
const handleChange = async (field, value) => {
  const updated = { ...profile, [field]: value };
  await profileAPI.saveProfile(updated); // ← Syncs to cloud
};
```

### Sync Indicators

Visual feedback shows sync status:
- 🟢 **Green pulse**: Synced to cloud
- 🟡 **Amber dot**: Guest mode (local only)
- 🔴 **Red**: Sync error (rare)

## 🎯 User Experience

### For Logged-In Users
1. **Add a task** → Instantly saved to cloud
2. **Close app** → Data persists
3. **Open on phone** → Data appears automatically
4. **Make changes** → Syncs across all devices
5. **Go offline** → Still works! Syncs when back online

### For Guest Users
1. **Use app normally** → Data saved locally
2. **No account required** → Full functionality
3. **Sign up later** → Migrate local data to cloud
4. **Privacy-first** → Data stays on your device

## 🛡️ Security Best Practices

### Row Level Security (RLS)

All tables have RLS enabled:
```sql
-- Users can only access their own data
CREATE POLICY "Users view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
```

### API Key Management
```bash
# ✅ DO: Use environment variables
VITE_SUPABASE_ANON_KEY=your-key

# ❌ DON'T: Hardcode keys in code
const key = "eyJhbGciOiJIUzI1NiIsInR..." // Never do this!
```

### Password Requirements
- Minimum 6 characters
- Email verification (optional but recommended)
- Secure password hashing via Supabase Auth

## 📈 Performance Optimization

### Caching Strategy
1. **First load**: Fetch from cloud
2. **Cache locally**: Store in localStorage
3. **Subsequent loads**: Use cache + sync in background
4. **Offline**: Use cached data only

### Batch Operations
```typescript
// Efficient: Update multiple tasks at once
await Promise.all(
  tasks.map(task => taskStore.updateTask(task.id, updates))
);
```

## 🐛 Troubleshooting

### Issue: Tasks not syncing

**Symptoms**: Changes don't appear on other devices

**Solutions**:
1. Check browser console for errors
2. Verify you're logged in (check Profile page)
3. Test internet connection
4. Log out and back in to force full sync

### Issue: "Error fetching tasks"

**Symptoms**: Console shows database errors

**Solutions**:
1. Verify database migration ran successfully
2. Check RLS policies are enabled
3. Confirm Supabase credentials are correct
4. Check Supabase project is active (not paused)

### Issue: Duplicate tasks

**Symptoms**: Same task appears multiple times

**Solutions**:
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Check for multiple browser tabs syncing simultaneously

### Issue: Auth not working

**Symptoms**: Can't log in or sign up

**Solutions**:
1. Verify `.env` file exists with correct credentials
2. Check VITE_SUPABASE_URL starts with `https://`
3. Restart dev server after changing `.env`
4. Check Supabase project is active

## 🔧 Advanced Configuration

### Custom Sync Intervals

Modify sync behavior in `supabaseData.ts`:

```typescript
// Sync every 30 seconds (example)
setInterval(async () => {
  if (user) {
    await syncHelpers.getMergedTasks();
  }
}, 30000);
```

### Offline Detection

Add online/offline indicators:

```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));
}, []);
```

### Migration from Local to Cloud

When user signs up, migrate existing data:

```typescript
// On first login after signup
const localTasks = taskStore.getTodayTasks();
await syncHelpers.syncLocalToCloud(localTasks);
```

## 📚 Related Documentation

- **`AUTH_SETUP.md`**: Complete authentication setup guide
- **`DATABASE_SETUP.md`**: Database schema and RLS policies
- **`supabase_migration.sql`**: SQL migration file
- **`AUTHENTICATION.md`**: User-facing auth guide

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

## 🚀 Next Steps

Want to enhance cloud sync? Consider adding:

1. **Real-time subscriptions**: Live updates across devices
2. **Conflict resolution**: Handle simultaneous edits gracefully
3. **Version history**: Track changes over time
4. **Data export**: Download all data as JSON/CSV
5. **Team sharing**: Collaborate on tasks with classmates

## 💡 Pro Tips

1. **Always log in** for the best experience
2. **Enable email verification** for production
3. **Monitor Supabase usage** on free tier (50k requests/month)
4. **Backup regularly** using Supabase export tools
5. **Test offline mode** before deploying

---

**Ready to enable cloud sync?** Follow the Quick Start above and enjoy seamless multi-device access! 🎉
