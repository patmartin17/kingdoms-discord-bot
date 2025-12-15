# 🔧 Bot Offline - Troubleshooting Guide

## ✅ Quick Checks

### 1. **Did you add environment variables in Railway?**

Go to: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

1. Click on your service
2. Click **"Variables"** tab
3. Make sure you have:
   - `DISCORD_TOKEN` = [Your bot token]
   - `GUILD_ID` = `1449896304665821474`

**If missing, add them now!** Railway will auto-redeploy.

---

### 2. **Is Railway service running?**

Check Railway dashboard:
- Service should show **"Active"** or **"Running"**
- If it says **"Stopped"** or **"Error"**, check logs

**View logs**: Click service → "Deployments" → Click latest deployment → "View Logs"

---

### 3. **Check Railway Logs**

Common errors:

**"Missing environment variables"**
- ✅ Add `DISCORD_TOKEN` and `GUILD_ID` in Variables tab

**"Cannot find module 'discord.js'"**
- ✅ Railway should auto-install, but check build logs

**"Error: GUILD_ID and DISCORD_TOKEN must be set"**
- ✅ Environment variables not set correctly

**"Invalid token"**
- ✅ Bot token might be wrong - get fresh one from Discord Developer Portal

---

### 4. **Verify Bot Token**

1. Go to: https://discord.com/developers/applications
2. Select **MakerBot** (your bot)
3. Go to **"Bot"** tab
4. Click **"Reset Token"** if needed
5. Copy new token
6. Update in Railway dashboard

---

### 5. **Check Railway Service Status**

**Dashboard**: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

Look for:
- ✅ Green status = Running
- ⚠️ Yellow status = Building/Deploying
- ❌ Red status = Error (check logs)

---

## 🚀 Quick Fix Steps

1. **Open Railway Dashboard**
   - https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

2. **Click your service** (kingdoms-discord-bot)

3. **Check "Variables" tab**
   - Must have `DISCORD_TOKEN` and `GUILD_ID`
   - If missing, add them

4. **Check "Deployments" tab**
   - Latest deployment should be successful
   - Click it → "View Logs" to see what's happening

5. **If service is stopped**
   - Click "Settings" → "Restart"

---

## 🔍 Common Issues

### Issue: Service shows "Stopped"
**Fix**: Click "Settings" → "Restart"

### Issue: Build failed
**Fix**: Check build logs - usually missing dependencies or wrong Node version

### Issue: Bot token invalid
**Fix**: Reset token in Discord Developer Portal, update in Railway

### Issue: Environment variables not working
**Fix**: Make sure they're set at **service level**, not project level

---

## ✅ Expected Logs (When Working)

When bot is online, Railway logs should show:
```
✅ Ticket Button Handler Ready!
Logged in as MakerBot#1234
```

---

## 🆘 Still Not Working?

1. **Check Railway logs** (most important!)
2. **Verify environment variables** are set correctly
3. **Check Discord Developer Portal** - is bot enabled?
4. **Try restarting** Railway service

---

**Most common issue**: Environment variables not added in Railway dashboard!

