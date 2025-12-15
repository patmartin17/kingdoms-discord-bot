# 🔧 Switch Railway to Nixpacks Builder

## Problem
Railway is using Railpack builder which detects Node.js 16. We need to switch to Nixpacks to use our `nixpacks.toml` file.

---

## ✅ Solution: Switch Builder in Railway Dashboard

### Step 1: Go to Settings
1. Railway Dashboard → Your Service
2. Click **"Settings"** tab (where you are now)

### Step 2: Change Builder
1. Find **"Builder"** section
2. You'll see:
   - **Railpack** (currently selected)
   - **Nixpacks** (select this!)
3. Click **"Nixpacks"**
4. Click **"Update"** button (bottom right)

### Step 3: Railway Will Redeploy
- Railway will detect the change
- It will use our `nixpacks.toml` file
- Build will use Node.js 18

---

## ✅ Alternative: Add NODE_VERSION Variable

If you can't switch builders, try this:

1. Go to **"Variables"** tab (not Settings)
2. Click **"+ New Variable"**
3. Add:
   - **Key**: `NODE_VERSION`
   - **Value**: `18`
4. Save

This might override Railpack's detection.

---

## 🎯 Best Solution: Both!

1. ✅ Add `NODE_VERSION = 18` in Variables tab
2. ✅ Switch Builder to Nixpacks in Settings tab
3. ✅ Railway will definitely use Node.js 18

---

**Try switching to Nixpacks builder first - that's the most reliable!**

