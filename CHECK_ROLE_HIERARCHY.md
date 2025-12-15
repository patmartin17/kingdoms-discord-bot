# Fix Role Hierarchy Issue

## The Problem
Even with "Manage Channels" permission, the bot needs its **role to be high enough** in the server's role hierarchy.

---

## 🔧 How to Fix Role Hierarchy

### Step 1: Check Bot's Role Position

1. Open Discord → Go to "Riven Realms" server
2. Go to **Server Settings** (right-click server → Server Settings)
3. Click **"Roles"** in left sidebar
4. Look at the role list - roles are ordered from **highest to lowest** (top = most powerful)

### Step 2: Move Bot Role Higher

1. Find your bot's role (probably named "MakerBot" or similar)
2. **Drag it UP** in the list
3. It should be:
   - ✅ Below Owner/Admin roles (if you have them)
   - ✅ Above regular member roles
   - ✅ Ideally near the top

### Step 3: Verify Permissions

While you're in the bot's role settings:
1. Scroll down to **"Permissions"**
2. Make sure these are enabled (green checkmarks):
   - ✅ `Manage Channels`
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`

### Step 4: Save and Test

1. Click **"Save Changes"** if you made any changes
2. Run the script again

---

## 🎯 Quick Checklist

- [ ] Bot role is high enough in hierarchy (drag it up)
- [ ] "Manage Channels" permission is enabled
- [ ] "View Channels" permission is enabled
- [ ] Role is saved

---

## 💡 Why This Happens

Discord's permission system works like this:
- Even if a role has "Manage Channels", it can't manage channels created by roles **above** it
- The bot's role must be **higher** than the channels it's trying to create
- Since we're creating new channels, the bot role just needs to be reasonably high

---

**After moving the bot role higher, run the script again!**

