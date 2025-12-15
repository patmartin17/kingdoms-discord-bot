# 🔧 Fix Nixpacks Node.js Version

## Problem
Nixpacks is still using Node.js 16 even after switching builders.

## ✅ Solution: Add NODE_VERSION Environment Variable

Nixpacks respects the `NODE_VERSION` environment variable. Add it:

### Step 1: Go to Variables Tab
1. Railway Dashboard → Your Service
2. Click **"Variables"** tab

### Step 2: Add NODE_VERSION
1. Click **"+ New Variable"**
2. **Key**: `NODE_VERSION`
3. **Value**: `18` (or `18.20.0` for specific version)
4. Click **"Add"**

### Step 3: Redeploy
Railway will auto-redeploy with Node.js 18.

---

## 🔍 Verify in Logs

After redeploy, check logs. Look for:
- ✅ `Using Node.js v18.x.x` (should show 18!)
- ✅ No `ReadableStream` errors

---

## 📋 Updated nixpacks.toml

I've also updated the `nixpacks.toml` file with correct syntax. Push to GitHub:

```bash
git add nixpacks.toml
git commit -m "Fix nixpacks.toml Node.js version"
git push
```

But **adding NODE_VERSION variable is the fastest fix!**

---

**Add NODE_VERSION = 18 in Variables tab - that's the most reliable way!**

