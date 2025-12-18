# 🎨 Role Icons Setup Guide

## ✅ Your Server Status
- **Server Boost Level**: Tier 3 (14 boosts) ✅
- **Role Icons**: Enabled! ✅

---

## 🚀 Quick Setup (Manual - 5 minutes)

Since Discord doesn't support setting Unicode emojis programmatically for role icons, here's the fastest way:

### Step-by-Step:

1. **Open Discord** → Your Server
2. **Server Settings** → **Roles**
3. For each role, click on it:
   - **Citizen** → Scroll to "Role Icon" → Click "Set Icon" → Choose emoji picker → Select ⚪ → Save
   - **Apprentice** → Role Icon → Set Icon → Select 🟢 → Save
   - **Knight** → Role Icon → Set Icon → Select 🟣 → Save
   - **Noble** → Role Icon → Set Icon → Select 🟡 → Save
   - **Mod** → Role Icon → Set Icon → Select 🔵 → Save
   - **Admin** → Role Icon → Set Icon → Select 🔴 → Save

**That's it!** Your role icons will now appear next to usernames in chat.

---

## 🎯 Alternative: Upload as Server Emojis (Then Auto-Set)

If you want to automate this, you can:

1. **Upload the emojis as server emojis first:**
   - Server Settings → Emoji → Upload Emoji
   - Upload each circle emoji (⚪ 🟢 🟣 🟡 🔵 🔴)
   - Name them: `citizen_circle`, `apprentice_circle`, etc.

2. **Then run the script** with the server emoji names instead

---

## 📋 Role Icon Reference

| Role | Icon | Color |
|------|------|-------|
| Citizen | ⚪ | Gray |
| Apprentice | 🟢 | Green |
| Knight | 🟣 | Purple |
| Noble | 🟡 | Yellow |
| Mod | 🔵 | Blue |
| Admin | 🔴 | Red |

---

## 💡 Tips

- Role icons appear next to usernames in chat
- They replace (or appear alongside) the colored circle
- With Tier 3, you can use custom images too (64x64px recommended)
- Icons are visible to everyone in the server

---

## 🔧 Troubleshooting

**Icons not showing?**
- Make sure the role is "hoisted" (Display role members separately)
- Check that the role is above @everyone
- Verify server boost level is 2+

**Can't set icon?**
- Make sure you have "Manage Roles" permission
- Check that MakerBot's role is high enough
- Verify server boost level

---

## ✅ Done!

Once set, your role icons will appear automatically for all members with those roles!

