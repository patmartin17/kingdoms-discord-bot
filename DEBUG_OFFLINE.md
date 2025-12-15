# 🔍 Debug Bot Offline Issue

## ✅ Railway Says "Running" But Bot Offline

If Railway shows "Built and Running" but Discord shows bot offline, check these:

---

## 🔍 Step 1: Check Railway Logs

**Go to**: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

1. Click your service
2. Click **"Deployments"** → Latest deployment
3. Click **"View Logs"**

**Look for:**
- ✅ `✅ Ticket Button Handler Ready!` = Bot connected
- ❌ `Error: GUILD_ID and DISCORD_TOKEN must be set` = Missing env vars
- ❌ `Invalid token` = Wrong bot token
- ❌ `Missing Access` = Bot not in server
- ❌ `ReadableStream` error = Still Node.js version issue

---

## 🔍 Step 2: Verify Environment Variables

In Railway dashboard:
1. Click service → **"Variables"** tab
2. **Must have exactly:**
   - `DISCORD_TOKEN` = [Your bot token from Discord Developer Portal]
   - `GUILD_ID` = `1449896304665821474`

**Common mistakes:**
- ❌ Extra spaces around values
- ❌ Quotes around values (don't use quotes)
- ❌ Wrong variable names (case-sensitive)

---

## 🔍 Step 3: Check Bot Token

1. Go to: https://discord.com/developers/applications
2. Select **MakerBot**
3. Go to **"Bot"** tab
4. **Verify:**
   - ✅ Token is visible (click "Reset Token" if needed)
   - ✅ Copy token exactly (no extra spaces)
   - ✅ Update in Railway dashboard

---

## 🔍 Step 4: Verify Bot is in Server

1. Open Discord
2. Go to your server
3. Check member list - is **MakerBot** there?
4. If not:
   - Go to Discord Developer Portal
   - OAuth2 → URL Generator
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: All
   - Copy URL and invite bot again

---

## 🔍 Step 5: Check Bot Intents

In Discord Developer Portal:
1. Go to **MakerBot** → **"Bot"** tab
2. Scroll to **"Privileged Gateway Intents"**
3. **Enable:**
   - ✅ **Message Content Intent** (required!)
   - ✅ **Server Members Intent** (if needed)

**Without Message Content Intent, bot won't connect!**

---

## 🔍 Step 6: Check Railway Logs for Errors

Common log messages:

**Good:**
```
✅ Ticket Button Handler Ready!
Logged in as MakerBot#1234
```

**Bad:**
```
Error: GUILD_ID and DISCORD_TOKEN must be set
→ Add environment variables in Railway
```

```
Invalid token
→ Reset token in Discord Developer Portal, update Railway
```

```
Missing Access
→ Bot not in server - re-invite bot
```

---

## 🚀 Quick Fix Checklist

- [ ] Environment variables added in Railway?
- [ ] Bot token correct (no extra spaces)?
- [ ] Bot is in your Discord server?
- [ ] Message Content Intent enabled?
- [ ] Railway logs show "Ready!" message?
- [ ] Service restarted after adding env vars?

---

## 🆘 Still Offline?

**Share Railway logs** - they'll tell us exactly what's wrong!

1. Railway dashboard → Service → Deployments → Latest → View Logs
2. Copy the last 20-30 lines
3. Check for any error messages

---

**Most common issue**: Environment variables not set correctly in Railway!

