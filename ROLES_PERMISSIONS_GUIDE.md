# Discord Roles & Permissions Setup Guide

## 🎯 What This Script Does

The `setup-roles.js` script automatically creates a complete role hierarchy with proper permissions for your Discord server.

---

## 👥 Roles Created (Lowest to Highest)

### 1. **Muted** (Gray)
- **Purpose**: Punishment role for rule breakers
- **Permissions**: None (can't do anything)
- **Visible**: No (doesn't show separately)

### 2. **Member** (Discord Blurple)
- **Purpose**: Default role for all members
- **Permissions**: Basic chat and voice
- **Auto-assign**: Yes (via bot)

### 3. **Verified** (Green)
- **Purpose**: Members who linked their account
- **Permissions**: Same as Member
- **Auto-assign**: When account is linked
- **Visible**: Yes (shows separately)

### 4. **VIP** (Gold/Yellow)
- **Purpose**: Special members/donators
- **Permissions**: Priority speaker, extra features
- **Visible**: Yes

### 5. **Support Staff** (Pink)
- **Purpose**: Handle tickets and help users
- **Permissions**: Manage messages, handle tickets
- **Visible**: Yes

### 6. **Moderator** (Red)
- **Purpose**: Full moderation powers
- **Permissions**: Kick, mute, manage channels, etc.
- **Cannot**: Ban members (Admin only)
- **Visible**: Yes

### 7. **Administrator** (Discord Blurple)
- **Purpose**: Server management
- **Permissions**: Almost everything including ban
- **Can**: Manage roles, manage server
- **Visible**: Yes

### 8. **Owner** (Red)
- **Purpose**: Full control
- **Permissions**: Administrator (full access)
- **Visible**: Yes

---

## 🔐 Permission Details

### Member Permissions:
- ✅ View Channels
- ✅ Send Messages
- ✅ Read Message History
- ✅ Connect to Voice
- ✅ Speak in Voice

### Moderator Permissions:
- ✅ Everything Member has, plus:
- ✅ Manage Messages
- ✅ Manage Channels
- ✅ Kick Members
- ✅ Mute/Deafen Members
- ✅ Move Members
- ✅ Manage Nicknames

### Administrator Permissions:
- ✅ Everything Moderator has, plus:
- ✅ Ban Members
- ✅ Manage Roles
- ✅ Manage Server

---

## 🚀 How to Run

```bash
node setup-roles.js
```

Or add to package.json:
```json
"scripts": {
  "setup-roles": "node setup-roles.js"
}
```

Then run:
```bash
npm run setup-roles
```

---

## ⚙️ Customization

### Change Role Colors

Edit `setup-roles.js` and modify the `color` field:

```javascript
{
    name: 'VIP',
    color: '#FEE75C', // Change this hex color
    // ...
}
```

### Add/Remove Roles

Add or remove entries from the `roleStructure` array:

```javascript
{
    name: 'New Role',
    color: '#FF5733',
    permissions: {
        ViewChannels: true,
        SendMessages: true
    },
    mentionable: false,
    hoist: false,
    position: 2
}
```

### Modify Permissions

Edit the `permissions` object for each role:

```javascript
permissions: {
    ViewChannels: true,  // Can see channels
    SendMessages: true, // Can send messages
    ManageMessages: true, // Can delete messages
    // ... more permissions
}
```

---

## 📋 Available Permissions

Common permissions you can use:

### Channel Permissions:
- `ViewChannels` - See channels
- `SendMessages` - Send text messages
- `ReadMessageHistory` - Read old messages
- `ManageMessages` - Delete messages
- `EmbedLinks` - Post embeds
- `AttachFiles` - Upload files
- `ManageChannels` - Edit channels

### Voice Permissions:
- `Connect` - Join voice channels
- `Speak` - Talk in voice
- `MuteMembers` - Mute others
- `DeafenMembers` - Deafen others
- `MoveMembers` - Move others
- `PrioritySpeaker` - Speak over others

### Member Permissions:
- `KickMembers` - Kick users
- `BanMembers` - Ban users
- `ManageNicknames` - Change nicknames
- `ManageRoles` - Manage roles

### Server Permissions:
- `ManageGuild` - Manage server settings
- `Administrator` - Full admin access

---

## 🎯 Setting Up Auto-Roles

### Using MEE6 Bot:

1. Invite MEE6 to your server
2. Go to MEE6 dashboard: https://mee6.xyz
3. Select your server
4. Go to "Roles" → "Auto-Roles"
5. Add "Member" role to auto-assign on join

### Using Dyno Bot:

1. Invite Dyno to your server
2. Use command: `?autorole add Member`
3. Or use web dashboard

### Using Your Custom Bot:

```javascript
client.on('guildMemberAdd', async (member) => {
    const memberRole = member.guild.roles.cache.find(r => r.name === 'Member');
    if (memberRole) {
        await member.roles.add(memberRole);
    }
});
```

---

## 🔗 Role Permissions for Channels

After creating roles, you can set channel-specific permissions:

### Example: Staff-Only Channel

1. Right-click channel → "Edit Channel"
2. Go to "Permissions" tab
3. Click "+" → Add role "Staff"
4. Enable permissions for Staff role
5. Disable "View Channel" for @everyone

### Example: Read-Only Channel

1. Right-click channel → "Edit Channel"
2. Go to "Permissions" tab
3. Select @everyone role
4. Disable "Send Messages"
5. Enable "View Channel" and "Read Message History"

---

## ✅ After Running the Script

1. **Review Roles**: Check Discord server → Server Settings → Roles
2. **Assign Roles**: Manually assign roles to users
3. **Set Up Auto-Roles**: Configure bot to auto-assign "Member" role
4. **Configure Channel Permissions**: Set up staff-only channels
5. **Test Permissions**: Make sure everything works as expected

---

## 🛠️ Advanced: Channel-Specific Role Setup

Want to automatically set channel permissions? I can create a script that:
- Sets up staff-only channels
- Configures read-only channels
- Sets up voice channel permissions
- Configures ticket channel permissions

Just ask!

---

## 📝 Role Hierarchy Best Practices

1. **@everyone** - Always at bottom (position 0)
2. **Muted** - Low position (can't do anything)
3. **Member** - Default for all
4. **Verified** - Above Member
5. **VIP** - Special members
6. **Support Staff** - Staff roles
7. **Moderator** - Higher staff
8. **Administrator** - High position
9. **Owner** - Highest position

**Rule**: Higher roles can manage lower roles, but not vice versa.

---

## 🎨 Role Colors Reference

- **Gray** (`#808080`) - Muted/Punishment
- **Blurple** (`#5865F2`) - Default/Member
- **Green** (`#57F287`) - Verified/Success
- **Gold** (`#FEE75C`) - VIP/Premium
- **Pink** (`#EB459E`) - Support/Helper
- **Red** (`#ED4245`) - Moderation/Danger
- **Dark Red** (`#FF0000`) - Owner/Admin

---

**Run the script and your roles will be set up automatically! 🎉**

