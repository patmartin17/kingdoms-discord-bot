# Quick Deploy to Render - Step by Step

## 🚀 Fastest Way (Dashboard)

### Step 1: Prepare Your Code

Your code is ready! Just need to:

1. **Make sure these files exist:**
   - ✅ `activate-ticket-buttons.js` (main bot file)
   - ✅ `package.json` (dependencies)
   - ✅ `.env` (has your tokens - DON'T commit this!)

2. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Discord bot for Render"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy on Render Dashboard

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Background Worker"
3. **Connect**: Your GitHub account/repo
4. **Select**: Your repository
5. **Configure**:
   - **Name**: `kingdoms-discord-bot`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or `master`)
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node activate-ticket-buttons.js`)
   - **Plan**: Free (or Starter for $7/mo - no sleep)

6. **Environment Variables** (Click "Advanced"):
   - `DISCORD_TOKEN` = `your_bot_token_here` (Get from Discord Developer Portal)
   - `GUILD_ID` = `your_server_id_here` (Right-click server → Copy ID)

7. **Click**: "Create Background Worker"

### Step 3: Wait & Verify

1. Render will build and deploy (takes 2-3 minutes)
2. Check logs - should see "✅ Ticket Button Handler Ready!"
3. Test buttons in Discord - should work!

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Sleeps after 15 minutes** of inactivity
- Bot will disconnect when sleeping
- **Solution**: Upgrade to Starter ($7/mo) for always-on

### Environment Variables:
- **Never commit** `.env` to GitHub
- Set them in Render dashboard only
- They're secure there

---

## ✅ After Deployment

- Bot runs 24/7 (or until sleep on free tier)
- Auto-restarts if crashes
- Logs available in dashboard
- Can update by pushing to GitHub

---

## 🔧 Update Bot Later

Just push to GitHub:
```bash
git add .
git commit -m "Update bot"
git push
```

Render auto-deploys!

---

**Ready to deploy? Follow the steps above!**
