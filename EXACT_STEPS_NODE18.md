# 🎯 Exact Steps: Set Node.js 18 in Railway

## ✅ Solution: Add NODE_VERSION Environment Variable

Railway doesn't have a "Node Version" setting. Instead, add `NODE_VERSION` as an environment variable.

---

## 📋 Step-by-Step (Exact Location)

### Step 1: Go to Railway Dashboard
**URL**: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934

### Step 2: Click Your Service
- Click on **"kingdoms-discord-bot"** (the service name)

### Step 3: Click "Variables" Tab
- At the top, you'll see tabs: **"Deployments"**, **"Metrics"**, **"Variables"**, **"Settings"**
- Click **"Variables"**

### Step 4: Add NODE_VERSION Variable
- Click **"+ New Variable"** button (usually top right)
- **Key**: `NODE_VERSION`
- **Value**: `18`
- **DO NOT** add quotes around the value
- Click **"Add"** or **"Save"**

### Step 5: Verify
- You should now see:
  - `DISCORD_TOKEN` = [your token]
  - `GUILD_ID` = `1449896304665821474`
  - `NODE_VERSION` = `18`

### Step 6: Railway Auto-Redeploys
- Railway will automatically detect the change
- A new deployment will start (you'll see it in "Deployments" tab)
- Wait 1-2 minutes for build to complete

---

## ✅ Verify It Worked

1. Go to **"Deployments"** tab
2. Click the **latest deployment**
3. Click **"View Logs"**
4. Look for:
   - ✅ `Using Node.js v18.x.x` (should show version 18)
   - ✅ No more `ReadableStream` errors
   - ✅ `✅ Ticket Button Handler Ready!`

---

## 🎯 Visual Guide

```
Railway Dashboard
├── Project: kingdoms-discord-bot
│   └── Service: kingdoms-discord-bot
│       ├── [Deployments] ← Click here to see builds
│       ├── [Metrics]
│       ├── [Variables] ← CLICK HERE!
│       │   └── + New Variable
│       │       ├── Key: NODE_VERSION
│       │       └── Value: 18
│       └── [Settings]
```

---

## 🔍 If You Don't See "Variables" Tab

1. Make sure you clicked on the **service** (not the project)
2. The service name should be visible at the top
3. If you're at project level, click into the service first

---

## ✅ After Adding NODE_VERSION

Railway will:
1. ✅ Detect the new variable
2. ✅ Start a new build
3. ✅ Use Node.js 18 for the build
4. ✅ Deploy with Node.js 18
5. ✅ Bot should come online!

---

**The key is: Add `NODE_VERSION = 18` in the Variables tab!**

