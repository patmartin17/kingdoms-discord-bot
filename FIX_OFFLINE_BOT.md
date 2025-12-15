# 🔧 Fix Offline Bot - Step by Step

## ⚡ Quick Fix (Most Likely Issue)

### Step 1: Check Railway Dashboard
**Go to**: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

### Step 2: Click Your Service
Click on the service that says `kingdoms-discord-bot` (or similar)

### Step 3: Check Variables Tab
1. Click **"Variables"** tab
2. **Do you see** `DISCORD_TOKEN` and `GUILD_ID`?
   - ❌ **If NO** → Add them (see below)
   - ✅ **If YES** → Check if values are correct

### Step 4: Add Environment Variables (If Missing)

Click **"+ New Variable"** and add:

**Variable 1:**
- **Key**: `DISCORD_TOKEN`
- **Value**: [Get from Discord Developer Portal]
  - Go to: https://discord.com/developers/applications
  - Select **MakerBot**
  - Go to **"Bot"** tab
  - Click **"Reset Token"** (or copy existing)
  - Paste here

**Variable 2:**
- **Key**: `GUILD_ID`
- **Value**: `1449896304665821474`

**Save** → Railway will auto-redeploy!

---

## 🔍 Check Logs

1. In Railway dashboard, click **"Deployments"** tab
2. Click the **latest deployment**
3. Click **"View Logs"**

**Look for:**
- ✅ `✅ Ticket Button Handler Ready!` = Working!
- ❌ `Error: GUILD_ID and DISCORD_TOKEN must be set` = Missing env vars
- ❌ `Invalid token` = Wrong bot token
- ❌ `Cannot find module` = Build issue

---

## 🚀 Restart Service

If variables are set but bot still offline:

1. Click **"Settings"** tab
2. Click **"Restart"** button
3. Wait 30 seconds
4. Check Discord - bot should come online

---

## ✅ Verify Bot Token

1. Go to: https://discord.com/developers/applications
2. Select **MakerBot**
3. Go to **"Bot"** tab
4. Make sure:
   - ✅ **"Public Bot"** is OFF (if you want it private)
   - ✅ **"Message Content Intent"** is ON
   - ✅ **"Server Members Intent"** is ON (if needed)
5. Copy token → Update in Railway

---

## 🎯 Most Common Fix

**90% of the time**: Environment variables not added!

1. Go to Railway dashboard
2. Click service → Variables tab
3. Add `DISCORD_TOKEN` and `GUILD_ID`
4. Save → Auto-redeploys
5. Check Discord in 30 seconds

---

**Still offline?** Check Railway logs - they'll tell you exactly what's wrong!

