# ⚡ Quick Fix: Bot Offline

## 🔍 Check Railway Logs First!

**Go to**: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

1. Click your service
2. Click **"Deployments"** → Latest deployment
3. Click **"View Logs"**

**What do you see?**

---

## ✅ If Logs Show "✅ Ticket Button Handler Ready!"

**Bot is connected!** But Discord shows offline. Check:

1. **Is bot actually in your server?**
   - Open Discord → Your server → Member list
   - Is **MakerBot** there?
   - If not → Re-invite bot (see below)

2. **Bot might be "idle" but online**
   - Check member list - bot should show as online
   - Try using a ticket button - does it work?

---

## ❌ If Logs Show Errors

### Error: "GUILD_ID and DISCORD_TOKEN must be set"
**Fix**: Add environment variables in Railway
- Service → Variables tab
- Add `DISCORD_TOKEN` and `GUILD_ID`

### Error: "Invalid token"
**Fix**: Reset bot token
- Discord Developer Portal → MakerBot → Bot tab
- Click "Reset Token"
- Copy new token → Update in Railway

### Error: "Missing Access" or "Forbidden"
**Fix**: Re-invite bot to server
- See "Re-invite Bot" section below

### No "Ready!" message at all
**Fix**: Bot isn't connecting
- Check environment variables
- Check bot token
- Check Railway logs for errors

---

## 🔄 Re-invite Bot to Server

1. Go to: https://discord.com/developers/applications
2. Select **MakerBot**
3. Go to **"OAuth2"** → **"URL Generator"**
4. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
5. Select permissions:
   - ✅ All permissions (or at least: View Channels, Send Messages, Manage Channels, Manage Messages)
6. Copy the generated URL
7. Open URL in browser
8. Select your server → Authorize

---

## 🔐 Verify Environment Variables

In Railway dashboard:
1. Service → **"Variables"** tab
2. **Must have:**
   - `DISCORD_TOKEN` = [Your bot token - NO quotes, NO spaces]
   - `GUILD_ID` = `1449896304665821474`

**Common mistakes:**
- ❌ Quotes around values (`"token"` → should be `token`)
- ❌ Extra spaces (` token ` → should be `token`)
- ❌ Wrong variable name (case-sensitive: `DISCORD_TOKEN` not `discord_token`)

---

## 🚀 Restart Service

After fixing environment variables:

1. Railway dashboard → Service → **"Settings"**
2. Click **"Restart"**
3. Wait 30 seconds
4. Check logs again

---

## 📋 Share Logs

**Copy the last 20-30 lines from Railway logs** and share them - I can tell you exactly what's wrong!

**Most common issue**: Environment variables not set correctly!

