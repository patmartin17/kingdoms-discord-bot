# Quick Setup - You're Almost There! 🚀

## What You Have vs What We Need

✅ **Bot ID**: `1449896947199643672` (we'll use this later)  
✅ **Public Key**: `8e14449168b716b0e34e1a6d2a2857e932588e16303fe8dee7ca5302c670ff61` (for slash commands)  
❌ **Bot Token**: **We need this!** (this is the "password" for your bot)

---

## Step 1: Get Your Bot Token

1. Go to: **https://discord.com/developers/applications**
2. Click on your application (the one with ID `1449896947199643672`)
3. Click **"Bot"** in the left sidebar
4. Scroll down to the **"Token"** section
5. You'll see either:
   - A button that says **"Reset Token"** - Click it → Click "Yes, do it!" → Token appears
   - A button that says **"Copy"** - Click it to copy the token
   - Or the token might already be visible (if so, click "Copy")

6. **Copy the token** - It will be a long string of letters and numbers
   (Usually 59+ characters, format: part1.part2.part3)

⚠️ **IMPORTANT**: This token is secret! Don't share it publicly.

---

## Step 2: Get Your Server (Guild) ID

1. Open Discord (desktop or web)
2. Go to **User Settings** (gear icon) → **Advanced**
3. Enable **"Developer Mode"** (toggle it ON)
4. Go back to your Discord server
5. **Right-click** on your server name (at the top of the channel list)
6. Click **"Copy Server ID"** or **"Copy ID"**
7. **Save this number** - You'll need it!

---

## Step 3: Invite Bot to Your Server

1. Go back to: **https://discord.com/developers/applications**
2. Click on your application
3. Click **"OAuth2"** in the left sidebar
4. Click **"URL Generator"** (under OAuth2)
5. Under **"Scopes"**, check:
   - ✅ `bot`
   - ✅ `applications.commands` (optional)
6. Under **"Bot Permissions"**, check:
   - ✅ `Manage Channels`
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
7. Scroll down - you'll see a **"Generated URL"** at the bottom
8. **Copy that URL** and paste it in your browser
9. Select your server from the dropdown
10. Click **"Authorize"**
11. Complete CAPTCHA if needed
12. ✅ Bot should now appear in your server (offline/gray icon is normal)

---

## Step 4: Create .env File

1. In your project folder (`/home/pmartin/discord server`), create a file named `.env`
2. Open it in a text editor
3. Add these lines (replace with YOUR values):

```env
DISCORD_TOKEN=your_bot_token_from_step_1_here
GUILD_ID=your_server_id_from_step_2_here
```

**Example:**
```env
DISCORD_TOKEN=your_bot_token_from_discord_developer_portal
GUILD_ID=your_server_id_from_discord
```

4. **Save the file**

---

## Step 5: Install Dependencies

Open terminal in your project folder and run:

```bash
cd "/home/pmartin/discord server"
npm install
```

This will install `discord.js` and `dotenv`.

---

## Step 6: Run the Setup Script! 🎉

```bash
npm run setup
```

Or:

```bash
node setup-channels.js
```

---

## What Will Happen

The script will:
1. ✅ Connect to Discord using your bot token
2. ✅ Create all 7 categories
3. ✅ Create all ~28 channels
4. ✅ Set up permissions
5. ✅ Configure slow mode
6. ✅ Set channel topics
7. ✅ Organize everything

You'll see output like:
```
🚀 Starting Discord server setup...
✅ Bot logged in successfully
📋 Setting up server: Your Server Name
📁 Creating category: 📢 INFORMATION
   ✅ Created category: 📢 INFORMATION
   ✅ Created text channel: welcome
   ✅ Created text channel: announcements
...
✅ Channel setup complete!
```

---

## Troubleshooting

### "Invalid token" error
- ✅ Make sure you copied the ENTIRE token (it's long!)
- ✅ Check for extra spaces before/after
- ✅ Make sure it's in the `.env` file correctly

### "Missing Access" error
- ✅ Make sure you invited the bot to your server (Step 3)
- ✅ Check that bot has "Manage Channels" permission
- ✅ Make sure bot's role is high enough in server settings

### Bot not in server
- ✅ Complete Step 3 (invite bot)
- ✅ Refresh Discord
- ✅ Check that you selected the correct server

### "Cannot find module" error
- ✅ Run `npm install` first
- ✅ Make sure you're in the correct directory

---

## Quick Checklist

- [ ] Got bot token from Developer Portal → Bot → Token
- [ ] Got server ID (Developer Mode enabled, right-click server)
- [ ] Invited bot to server with correct permissions
- [ ] Created `.env` file with token and server ID
- [ ] Ran `npm install`
- [ ] Ran `npm run setup`
- [ ] Channels created! 🎉

---

**Once you have the bot token, paste it here and I can help you create the .env file, or just follow the steps above!**

