# Deploy to Render - Exact Steps with Your Values

## 🚀 Step-by-Step (Takes 2 Minutes)

### Step 1: Open Render Dashboard
**https://dashboard.render.com**

### Step 2: Create Background Worker
1. Click **"New +"** button (top right)
2. Click **"Background Worker"**

### Step 3: Connect GitHub
1. If not connected, click **"Connect GitHub"**
2. Authorize Render
3. Select repository: **`patmartin17/kingdoms-discord-bot`**

### Step 4: Configure Service

**Fill in these EXACT values:**

- **Name**: `kingdoms-discord-bot`
- **Environment**: `Node` (should auto-detect)
- **Region**: `Virginia` (or closest to you)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (or `Starter` $7/mo for always-on)

### Step 5: Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Click **"Add Environment Variable"** twice:

**Variable 1:**
- **Key**: `DISCORD_TOKEN`
- **Value**: [Get from Discord Developer Portal - Bot → Reset Token]

**Variable 2:**
- **Key**: `GUILD_ID`
- **Value**: `1449896304665821474`

### Step 6: Deploy!
Click **"Create Background Worker"** button at bottom

---

## ⏱️ What Happens Next

1. Render builds your bot (2-3 minutes)
2. Check **"Logs"** tab - should see:
   ```
   ✅ Ticket Button Handler Ready!
   Listening for button clicks...
   ```
3. Test buttons in Discord - should work!

---

## ✅ After Deployment

- ✅ Bot runs 24/7 on Render
- ✅ Auto-restarts if crashes  
- ✅ Logs available in dashboard
- ✅ Updates automatically when you push to GitHub

---

## 🛑 Stop Local Bot

Your local bot is already stopped. If you need to stop it again:

```bash
pkill -f "activate-ticket-buttons"
```

---

## 📊 Monitor Your Bot

- **Dashboard**: https://dashboard.render.com
- **Logs**: Click on your service → "Logs" tab
- **Status**: Should show "Live" when running

---

**Follow these steps and your bot will be live on Render in 2 minutes!**

