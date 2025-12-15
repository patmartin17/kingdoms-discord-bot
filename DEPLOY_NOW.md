# Deploy to Render - Right Now!

## 🚀 Quick Deploy Steps

### Step 1: Go to Render Dashboard
**https://dashboard.render.com**

### Step 2: Create Background Worker
1. Click **"New +"** → **"Background Worker"**
2. Connect GitHub (if not already)
3. Select repository: **`patmartin17/kingdoms-discord-bot`**

### Step 3: Configure
- **Name**: `kingdoms-discord-bot`
- **Environment**: `Node`
- **Region**: Choose closest
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or Starter $7/mo for always-on)

### Step 4: Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**:

1. **Key**: `DISCORD_TOKEN`
   **Value**: [Get from Discord Developer Portal - Bot → Reset Token]

2. **Key**: `GUILD_ID`
   **Value**: `1449896304665821474`

### Step 5: Deploy!
Click **"Create Background Worker"**

---

## ✅ After Deployment

- Bot will build (2-3 minutes)
- Check logs - should see "✅ Ticket Button Handler Ready!"
- Test buttons in Discord
- **Stop local bot** - it's now running on Render!

---

## 🛑 Stop Local Bot

```bash
pkill -f "activate-ticket-buttons"
```

Or just close the terminal.

---

**Your bot will run 24/7 on Render!**

