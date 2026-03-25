# 🚀 Deployment Checklist for Cloud Sync

Use this checklist when deploying Stu-Balance with cloud sync to Vercel or any hosting platform.

## ✅ Pre-Deployment Checklist

### Supabase Setup
- [ ] Created Supabase project
- [ ] Ran database migration (`supabase_migration.sql`)
- [ ] Verified tables exist in Table Editor
- [ ] Confirmed RLS policies are enabled
- [ ] Tested authentication locally
- [ ] Email provider configured (if using email confirmation)

### Environment Variables
- [ ] Created `.env` file locally
- [ ] Added `VITE_SUPABASE_URL` 
- [ ] Added `VITE_SUPABASE_ANON_KEY`
- [ ] Tested locally with real credentials
- [ ] `.env` file in `.gitignore` (never commit!)

### Code Testing
- [ ] Can sign up successfully
- [ ] Can log in successfully
- [ ] Tasks sync to cloud when logged in
- [ ] Tasks work offline (guest mode)
- [ ] Profile saves to cloud
- [ ] Logout works correctly
- [ ] No console errors

## 📦 Vercel Deployment

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Click "Import"

### Step 2: Configure Build Settings
```
Framework Preset: Vite
Build Command: npm run build (or pnpm build)
Output Directory: dist
Install Command: npm install (or pnpm install)
```

### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables:

```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: your-anon-key-here
Environment: Production, Preview, Development
```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

### Step 5: Verify Deployment
- [ ] Visit deployed URL
- [ ] Sign up for test account
- [ ] Add a test task
- [ ] Verify task syncs to Supabase
- [ ] Check Supabase Table Editor to confirm data

## 🔧 Post-Deployment

### Security Checks
- [ ] Test authentication on production URL
- [ ] Verify RLS is working (can't see other users' data)
- [ ] Check HTTPS is enabled
- [ ] Test CORS (if using custom domain)

### Supabase Configuration
- [ ] Add production URL to Supabase "Allowed Redirect URLs"
  - Go to: Authentication → URL Configuration
  - Add: `https://your-app.vercel.app/**`
- [ ] Configure email templates (optional)
- [ ] Set up email sender (if using email auth)

### PWA Configuration
- [ ] Verify service worker registers
- [ ] Test offline functionality
- [ ] Test "Add to Home Screen"
- [ ] Check manifest.json loads correctly

### Performance
- [ ] Test sync speed
- [ ] Check Lighthouse score
- [ ] Monitor Supabase usage
- [ ] Set up error logging (optional)

## 🌐 Custom Domain (Optional)

If using a custom domain:

### DNS Configuration
- [ ] Add domain in Vercel
- [ ] Update DNS records
- [ ] Wait for SSL certificate

### Supabase Updates
- [ ] Add custom domain to Supabase redirect URLs
- [ ] Update redirect URLs in authentication

## 📊 Monitoring

### Vercel
- [ ] Check deployment logs
- [ ] Monitor function logs (if using)
- [ ] Review analytics

### Supabase
- [ ] Monitor API usage
- [ ] Check database storage
- [ ] Review authentication metrics
- [ ] Set up alerts for quota limits

## 🐛 Common Deployment Issues

### Issue: Environment variables not working

**Solution**:
```bash
# Vercel uses different env prefix
# Make sure you're using VITE_ prefix for Vite projects
VITE_SUPABASE_URL=...  # ✅ Correct
SUPABASE_URL=...       # ❌ Won't work
```

### Issue: CORS errors

**Solution**:
- Add production URL to Supabase allowed origins
- Check redirect URLs in Supabase dashboard

### Issue: Build fails

**Solution**:
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify all dependencies installed
npm install
```

### Issue: Auth not working in production

**Solution**:
- Verify environment variables in Vercel
- Check Supabase allowed redirect URLs
- Test with incognito/private browser
- Clear browser cache

## 📱 Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test PWA installation on mobile
- [ ] Verify offline mode works
- [ ] Check responsive design

## 🔄 Update Workflow

When making changes:

1. **Development**
   ```bash
   # Make changes
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Automatic Deploy**
   - Vercel auto-deploys on push
   - Check deployment status in Vercel dashboard

3. **Verify Changes**
   - Test on preview URL first
   - Merge to main for production deploy

## 📈 Post-Launch

### User Onboarding
- [ ] Create user documentation
- [ ] Add setup instructions in app
- [ ] Create video tutorial (optional)

### Monitoring
- [ ] Track user signups
- [ ] Monitor sync errors
- [ ] Review database growth
- [ ] Check Supabase quota usage

### Maintenance
- [ ] Regular backups (Supabase auto-backups)
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Monitor error logs

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Users can sign up and log in
- ✅ Tasks sync across devices
- ✅ Offline mode works
- ✅ No console errors
- ✅ PWA installs correctly
- ✅ Performance is good (Lighthouse > 90)
- ✅ Mobile responsive
- ✅ Data persists after refresh

## 🆘 Need Help?

- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Supabase Issues**: [Supabase Discord](https://discord.supabase.com)
- **Check Logs**: Vercel Dashboard → Your Project → Logs
- **Database Issues**: Supabase Dashboard → SQL Editor → Run queries

---

## 🎓 Useful Commands

```bash
# Test production build locally
npm run build && npm run preview

# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Rollback to previous deployment
vercel rollback
```

---

**Ready to deploy?** Follow this checklist and you'll have a production-ready cloud-synced PWA! 🚀
