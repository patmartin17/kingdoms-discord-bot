# Automated Discord Server Setup Instructions

This guide will help you automatically create all channels, categories, and permissions for your Discord server using the Discord API.

---

## 🚀 Quick Start

### Prerequisites:
1. **Node.js** installed (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: Run `node --version` in terminal

2. **Discord Bot** created and invited to your server
   - See "Creating a Discord Bot" section below

3. **Bot Permissions** in your server:
   - Manage Channels
   - Manage Roles (optional, for advanced permissions)

---

## 📋 Step-by-Step Setup

### Step 1: Create a Discord Bot

**📖 Need more detail? See [HOW_TO_GET_BOT_TOKEN.md](./HOW_TO_GET_BOT_TOKEN.md) for a complete visual guide!**

**Quick version:**
1. Go to https://discord.com/developers/applications
2. **Log in with your Discord account** (you're creating a bot, not using your account directly)
3. Click **"New Application"**
4. Give it a name (e.g., "Server Setup Bot")
5. Go to the **"Bot"** section in the left sidebar
6. Click **"Add Bot"** → **"Yes, do it!"**
7. Under **"Token"**, click **"Reset Token"** → **"Yes, do it!"**
8. **Copy the token** (this is your "API key" - save it safely!)
9. Enable these settings:
   - ✅ **Message Content Intent** (under "Privileged Gateway Intents")
   - ✅ **Server Members Intent** (if you want member features)

**💡 Note:** You're creating a separate Bot account, not using your personal Discord account. The bot token is what authenticates the bot.

### Step 2: Invite Bot to Your Server

1. In the Discord Developer Portal, go to **"OAuth2"** → **"URL Generator"**
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ `Manage Channels`
   - ✅ `Manage Roles` (optional)
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`
4. Copy the generated URL at the bottom
5. Open the URL in your browser
6. Select your server and authorize

### Step 3: Get Your Server ID

1. Enable **Developer Mode** in Discord:
   - User Settings → Advanced → Enable Developer Mode
2. Right-click your server name
3. Click **"Copy Server ID"**
4. Save this ID (you'll need it)

### Step 4: Install Dependencies

Open terminal in this directory and run:

```bash
npm install
```

This will install:
- `discord.js` - Discord API library
- `dotenv` - For environment variables

### Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file and fill in:
   ```env
   DISCORD_TOKEN=your_bot_token_from_step_1
   GUILD_ID=your_server_id_from_step_3
   ```

   **Important:** Never share your bot token or commit `.env` to git!

### Step 6: Run the Setup Script

```bash
npm run setup
```

Or:
```bash
node setup-channels.js
```

### Step 7: Watch the Magic Happen! ✨

The script will:
- ✅ Create all 7 category categories
- ✅ Create all ~25-30 channels
- ✅ Set up proper permissions
- ✅ Configure slow mode where needed
- ✅ Set channel topics
- ✅ Organize everything in the right order

---

## 📊 What Gets Created

The script creates:

### Categories (7):
1. 📢 INFORMATION (5 channels)
2. 🔗 ACCOUNT & REWARDS (3 channels)
3. 💬 GENERAL CHAT (4 channels)
4. 🎮 GAMEPLAY (4 channels)
5. 🎤 VOICE CHANNELS (6 channels)
6. 🎫 SUPPORT & TICKETS (3 channels)
7. 👥 STAFF (3 channels, private)

### Total: ~28 channels

---

## ⚙️ Customization

### Modify Channel Structure

Edit `setup-channels.js` and modify the `channelStructure` object:

```javascript
const channelStructure = {
    categories: [
        {
            name: '📢 INFORMATION',
            channels: [
                {
                    name: 'welcome',
                    type: 'text',
                    topic: 'Your custom topic here',
                    slowmode: 0, // seconds
                    permissions: {
                        everyone: { view: true, send: false }
                    }
                }
                // Add more channels...
            ]
        }
        // Add more categories...
    ]
};
```

### Adjust Permissions

The script sets basic permissions, but you may want to:

1. **Create Staff Roles** manually in Discord
2. **Update permissions** for staff-only channels
3. **Configure bot-specific roles** for better control

---

## 🔧 Troubleshooting

### Error: "Invalid token"
- ✅ Check that your bot token is correct
- ✅ Make sure there are no extra spaces
- ✅ Token should start with something like `MTIzNDU2...`

### Error: "Missing Access" or "Missing Permissions"
- ✅ Make sure bot has "Manage Channels" permission
- ✅ Check bot's role position (should be above channels it manages)
- ✅ Re-invite bot with correct permissions

### Error: "Cannot find module 'discord.js'"
- ✅ Run `npm install` again
- ✅ Make sure you're in the correct directory

### Channels Created But Permissions Wrong
- ✅ This is normal - Discord permissions can be complex
- ✅ Manually adjust permissions in Discord
- ✅ The script sets basic permissions, fine-tune as needed

### Bot Not Responding
- ✅ Check if bot is online (green dot in Discord)
- ✅ Verify bot is in your server
- ✅ Check console for error messages

---

## 🎯 After Running the Script

### 1. Review Channels
- Check that all channels were created
- Verify channel order and organization
- Adjust any channel names/topics if needed

### 2. Set Up Roles
- Create "Staff" role (if not exists)
- Create "Moderator" role
- Create "Support Staff" role
- Set up role hierarchy

### 3. Configure Permissions
- Review staff-only channels
- Adjust permissions for specific roles
- Set up bot-specific roles if needed

### 4. Add Content
- Add welcome message to #welcome
- Add rules to #rules channel
- Set up ticket bot in #ticket-panel
- Configure other bots

### 5. Test Everything
- Test channel permissions
- Test voice channels
- Test ticket creation
- Verify everything works

---

## 🔒 Security Notes

### Bot Token Security:
- ⚠️ **NEVER** share your bot token
- ⚠️ **NEVER** commit `.env` file to git
- ⚠️ Add `.env` to `.gitignore`
- ✅ Keep token private and secure

### Permissions:
- ✅ Only grant necessary permissions
- ✅ Use role-based permissions when possible
- ✅ Regularly review bot permissions

---

## 📝 Advanced Usage

### Run Script Multiple Times

The script will attempt to create channels even if they exist. Discord will handle duplicates gracefully, but you may want to:

1. Delete existing channels first (manual)
2. Or modify script to check for existing channels

### Partial Setup

You can modify the script to only create specific categories by commenting out sections:

```javascript
// Skip this category
// {
//     name: '🎤 VOICE CHANNELS',
//     channels: [...]
// }
```

### Custom Permissions

For more advanced permission setup, modify the permission logic in the script or set up roles first, then run the script.

---

## 🆘 Need Help?

### Common Issues:
- Check Discord.js documentation: https://discord.js.org
- Check Discord API docs: https://discord.com/developers/docs
- Review error messages in console

### Discord Developer Resources:
- Discord Developer Portal: https://discord.com/developers
- Discord.js Guide: https://discordjs.guide
- Discord API Server: https://discord.gg/discord-api

---

## ✅ Checklist

Before running:
- [ ] Node.js installed
- [ ] Discord bot created
- [ ] Bot invited to server
- [ ] Bot has "Manage Channels" permission
- [ ] Server ID copied
- [ ] Bot token copied
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)

After running:
- [ ] All channels created successfully
- [ ] Permissions reviewed
- [ ] Roles set up
- [ ] Content added to channels
- [ ] Bots configured
- [ ] Everything tested

---

**That's it! Your Discord server structure is now set up automatically! 🎉**

