# Fix Bot Permissions - "Missing Permissions" Error

## ✅ Good News!
The bot connected successfully! It found your server "Riven Realms".  
But it needs **"Manage Channels"** permission to create channels.

---

## 🔧 How to Fix

### Option 1: Re-invite Bot with Correct Permissions (Easiest)

1. Go to: https://discord.com/developers/applications
2. Click "MakerBot" → "OAuth2" → "URL Generator"
3. Under **Scopes**, check:
   - ✅ `bot`
4. Under **Bot Permissions**, check:
   - ✅ `Manage Channels` ← **IMPORTANT!**
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
5. Copy the generated URL
6. Open it in browser → Select your server → **Authorize**
7. Discord will ask if you want to update permissions → Click **"Authorize"**

### Option 2: Fix Permissions in Discord Server

1. Open Discord → Go to your server "Riven Realms"
2. Go to **Server Settings** (right-click server → Server Settings)
3. Click **"Roles"** in left sidebar
4. Find your bot's role (should be named "MakerBot" or similar)
5. Click on it
6. Scroll to **"Permissions"**
7. Enable:
   - ✅ `Manage Channels`
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`
8. **IMPORTANT**: Make sure the bot's role is **HIGHER** than other roles in the hierarchy
   - Drag it up in the role list if needed
   - It should be near the top (but below Admin/Owner roles)

### Option 3: Use Direct URL (Quick Fix)

Use this URL (with Manage Channels permission):

```
https://discord.com/api/oauth2/authorize?client_id=1449896947199643672&permissions=268435456&scope=bot%20applications.commands
```

This grants "Manage Channels" permission. Open it → Select server → Authorize.

---

## ✅ After Fixing Permissions

Once permissions are fixed, run the script again:

```bash
npm run setup
```

Or:

```bash
node setup-channels.js
```

---

## 🔍 How to Verify Bot Has Permissions

1. In Discord, go to Server Settings → Roles
2. Find your bot's role
3. Check that `Manage Channels` is enabled (green checkmark)
4. Make sure the role is high enough in the list (drag it up if needed)

---

**Once you've fixed the permissions, let me know and we'll run the script again!**

