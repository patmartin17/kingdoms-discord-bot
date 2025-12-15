# Kingdoms Server - Role Structure Planning

## 🎯 Requirements
- Simple, not too many ranks
- Admin and Moderator (staff)
- No Owner role
- Baseline rank for new/unverified members
- Nice tags with icons
- Show in chat

---

## 💡 Option 1: Simple Progression (Recommended)

### Role Structure:
1. **Citizen** (Baseline) - Gray/Default color
   - New members who haven't completed tasks
   - Basic permissions only
   - Icon: 👤 or 🏰

2. **Knight** (Verified/Active) - Blue/Silver
   - Members who completed basic tasks/verified account
   - Full member permissions
   - Icon: ⚔️ or 🛡️

3. **Noble** (VIP/Donator) - Gold/Yellow (Optional)
   - Special members, donators, or long-time players
   - Extra perks (priority speaker, etc.)
   - Icon: 👑 or 💎

4. **Moderator** (Staff) - Red/Orange
   - Staff position
   - Moderation powers
   - Icon: 🔨 or ⚖️

5. **Administrator** (Staff) - Purple/Blue
   - Full admin powers
   - Icon: ⭐ or 👑

### Pros:
- Simple and clear progression
- Kingdom-themed names
- Easy to understand

---

## 💡 Option 2: Kingdom-Themed

### Role Structure:
1. **Peasant** (Baseline) - Brown/Gray
   - New members
   - Icon: 🌾 or 👨‍🌾

2. **Citizen** (Verified) - Blue
   - Verified/active members
   - Icon: 🏛️ or 👤

3. **Knight** (VIP) - Silver
   - Special members
   - Icon: ⚔️

4. **Moderator** (Staff) - Red
   - Icon: 🔨

5. **Administrator** (Staff) - Purple
   - Icon: 👑

### Pros:
- Very thematic
- Clear hierarchy

---

## 💡 Option 3: Ultra Simple (Minimal)

### Role Structure:
1. **Member** (Baseline) - Default color
   - Everyone starts here
   - Icon: 👤

2. **Verified** (Active) - Green
   - Completed tasks/verified
   - Icon: ✅

3. **Moderator** (Staff) - Red
   - Icon: 🔨

4. **Administrator** (Staff) - Purple
   - Icon: ⭐

### Pros:
- Simplest possible
- Easy to manage

---

## 🎨 Role Icons in Discord

Discord supports role icons! You can:
- Use emoji in role names: `⚔️ Knight`
- Use role icons (Discord Nitro feature - server boost level 2)
- Use emoji in role display

**Note**: Role icons (images) require Server Boost Level 2, but emoji in names work for everyone!

---

## 📋 Recommended: Option 1 (Simple Progression)

### Final Structure:
```
1. 👤 Citizen (Baseline - Gray)
   - New members, unverified
   - Basic chat permissions

2. ⚔️ Knight (Verified - Blue)
   - Completed tasks/verified account
   - Full member permissions

3. 👑 Noble (VIP - Gold) [Optional]
   - Special members
   - Extra perks

4. 🔨 Moderator (Staff - Red)
   - Moderation powers
   - Can kick, mute, manage channels

5. ⭐ Administrator (Staff - Purple)
   - Full admin powers
   - Can ban, manage roles, manage server
```

---

## 🔧 Customization Options

### Colors:
- **Citizen**: `#808080` (Gray) or `#95A5A6` (Light Gray)
- **Knight**: `#3498DB` (Blue) or `#9B59B6` (Purple)
- **Noble**: `#F1C40F` (Gold) or `#E67E22` (Orange)
- **Moderator**: `#E74C3C` (Red) or `#E67E22` (Orange)
- **Administrator**: `#9B59B6` (Purple) or `#5865F2` (Discord Blurple)

### Icons:
- Can use emoji in role names: `⚔️ Knight`
- Or use Unicode symbols
- Or keep names clean and use role icons (if you have Server Boost)

---

## ❓ Questions to Decide:

1. **Do you want the "Noble" VIP role, or just Citizen → Knight → Staff?**
   - If yes: 5 roles total
   - If no: 4 roles total (simpler)

2. **What should the baseline role be called?**
   - Citizen? Peasant? Member? Newcomer?

3. **What should verified/active members be called?**
   - Knight? Citizen? Verified? Active?

4. **What colors do you prefer?**
   - Kingdom colors? Your brand colors?

5. **Do you want emoji in role names?**
   - `⚔️ Knight` or just `Knight`?

---

## 🚀 Once You Decide:

I'll customize the `setup-roles.js` script with:
- Your chosen role names
- Your color scheme
- Proper permissions
- Role hierarchy
- Emoji/icons if you want them

Then you can run it and all roles will be created instantly!

---

**What do you think? Which option do you prefer, or want to mix and match?**

