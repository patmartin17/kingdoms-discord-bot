# Deploy Discord Bot to Render

## 🚀 Quick Deploy Steps

### Step 1: Push to GitHub (if not already)

1. Initialize git (if needed):
   ```bash
   cd "/home/pmartin/discord server"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repo and push:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy on Render

#### Option A: Using Render Dashboard (Easier)

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Background Worker"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `kingdoms-discord-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node activate-ticket-buttons.js`
   - **Plan**: Free (or paid if you want)

5. Add Environment Variables:
   - `DISCORD_TOKEN` = Your bot token
   - `GUILD_ID` = Your server ID

6. Click **"Create Background Worker"**

#### Option B: Using Render CLI (Faster)

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
cd "/home/pmartin/discord server"
render deploy
```

### Step 3: Verify

1. Check Render dashboard → Your service
2. Look at logs - should see "✅ Ticket Button Handler Ready!"
3. Test buttons in Discord - should work!

---

## 📝 Environment Variables Needed

Make sure these are set in Render:
- `DISCORD_TOKEN` = Your bot token
- `GUILD_ID` = Your server ID

---

## ✅ After Deployment

- Bot will run 24/7 automatically
- Auto-restarts if it crashes
- Logs available in Render dashboard
- Free tier: Sleeps after 15 min inactivity (upgrades available)

---

**Your bot will now run continuously on Render!**

