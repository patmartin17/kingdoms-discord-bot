# 🔧 Force Node.js 18 in Railway

## Problem
Railway is still using Node.js 16, causing `ReadableStream is not defined` error.

## ✅ Solution Applied

I've created multiple files to force Node.js 18:

1. ✅ `package.json` → `"node": ">=18.0.0"`
2. ✅ `.nvmrc` → `18`
3. ✅ `.node-version` → `18`
4. ✅ `nixpacks.toml` → Explicit Node.js 18 config
5. ✅ `railway.json` → Updated to use nixpacks config

---

## 🚀 Next Step: Set Node Version in Railway Dashboard

**Railway might not auto-detect the version. Set it manually:**

1. Go to: https://railway.app/project/80ac42a9-fbf5-4fd0-bf7b-277a11580934
2. Click your service
3. Click **"Settings"** tab
4. Find **"Node Version"** or **"Build Settings"**
5. **Set to**: `18` or `18.x` or `18.20.0`
6. Click **"Save"**
7. Click **"Redeploy"** or wait for auto-redeploy

---

## 🔄 Or: Push Changes and Redeploy

```bash
cd "/home/pmartin/discord server"
git add nixpacks.toml .node-version railway.json
git commit -m "Force Node.js 18 in Railway"
git push
```

Railway should auto-redeploy with Node.js 18.

---

## ✅ Verify

After redeploy, check Railway logs. You should see:
- ✅ No more `ReadableStream` errors
- ✅ `✅ Ticket Button Handler Ready!`
- ✅ Bot comes online

---

**Most reliable**: Set Node version manually in Railway dashboard Settings!

