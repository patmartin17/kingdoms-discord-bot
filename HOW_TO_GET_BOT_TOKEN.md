# How to Get Your Discord Bot Token (Step-by-Step)

## 🔑 Quick Answer

You don't use your personal Discord account. Instead, you create a **Bot** account and get a **Bot Token**. Think of it like creating a separate account that your server can control.

---

## 📋 Step-by-Step Guide

### Step 1: Go to Discord Developer Portal

1. Open your web browser
2. Go to: **https://discord.com/developers/applications**
3. **Log in with your Discord account** (yes, you log in with your personal account, but you're creating a bot, not using your account directly)

### Step 2: Create a New Application

1. Click the **"New Application"** button (top right, blue button)
2. Give it a name (e.g., "My Server Setup Bot" or "Hytale Server Bot")
3. Click **"Create"**

### Step 3: Create the Bot

1. In the left sidebar, click **"Bot"**
2. Click **"Add Bot"** button
3. A popup will appear asking "Do you want to add a bot to this application?"
4. Click **"Yes, do it!"**

### Step 4: Get Your Bot Token

1. Scroll down to the **"Token"** section
2. You'll see a button that says **"Reset Token"** or **"Copy"**
3. If you see "Reset Token", click it → Click **"Yes, do it!"** → The token will appear
4. Click **"Copy"** to copy the token
5. **SAVE THIS TOKEN SOMEWHERE SAFE** - You'll need it for the `.env` file

⚠️ **IMPORTANT:** 
- This token is like a password - **NEVER share it publicly**
- If someone gets your token, they can control your bot
- If you accidentally share it, click "Reset Token" immediately

### Step 5: Enable Bot Settings

While you're on the Bot page, enable these settings:

1. Under **"Privileged Gateway Intents"**, enable:
   - ✅ **Message Content Intent** (if you want the bot to read messages)
   - ✅ **Server Members Intent** (if you want member features)

2. Under **"Bot Permissions"**, you can see what permissions the bot will request (we'll set this when inviting)

### Step 6: Get Your Server ID

You'll need your Discord Server (Guild) ID:

1. Open Discord (desktop or web)
2. Go to **User Settings** (gear icon) → **Advanced**
3. Enable **"Developer Mode"** (toggle it on)
4. Go back to your server
5. **Right-click** on your server name (at the top of the channel list)
6. Click **"Copy Server ID"** (or "Copy ID" depending on version)
7. **Save this ID** - You'll need it for the `.env` file

### Step 7: Invite Bot to Your Server

1. Go back to Discord Developer Portal
2. Click **"OAuth2"** in the left sidebar
3. Click **"URL Generator"** (under OAuth2)
4. Under **"Scopes"**, check:
   - ✅ `bot`
   - ✅ `applications.commands` (optional, for slash commands)
5. Under **"Bot Permissions"**, check:
   - ✅ `Manage Channels`
   - ✅ `Manage Roles` (optional, for advanced permissions)
   - ✅ `View Channels`
   - ✅ `Send Messages`
   - ✅ `Read Message History`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
6. Scroll down and **copy the generated URL** (it will look like: `https://discord.com/api/oauth2/authorize?...`)
7. **Paste the URL in your browser** and press Enter
8. Select your server from the dropdown
9. Click **"Authorize"**
10. Complete any CAPTCHA if prompted
11. ✅ Your bot should now appear in your server (offline, with a gray icon)

---

## 🔧 Setting Up the Script

### Step 8: Configure the `.env` File

1. In your project folder, create a file named `.env` (or copy `env-template.txt` and rename it)
2. Open `.env` in a text editor
3. Add your bot token and server ID:

```env
DISCORD_TOKEN=paste_your_bot_token_here
GUILD_ID=paste_your_server_id_here
```

**Example:**
```env
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTA.ABCDEF.ghijklmnopqrstuvwxyz1234567890
GUILD_ID=987654321098765432
```

4. **Save the file**

### Step 9: Run the Setup Script

1. Open terminal/command prompt in your project folder
2. Run:
   ```bash
   npm install
   ```
3. Then run:
   ```bash
   npm run setup
   ```
4. Watch the magic happen! ✨

---

## 🎯 Visual Guide

```
Discord Developer Portal
├── Applications
│   └── Your Application
│       ├── General Information
│       ├── Bot ← GO HERE
│       │   └── Token ← COPY THIS
│       ├── OAuth2 ← FOR INVITING BOT
│       └── ...
```

---

## ❓ Common Questions

### Q: Do I use my personal Discord account?
**A:** No! You create a separate Bot account. You log into the Developer Portal with your personal account, but the bot is a separate entity.

### Q: What's the difference between my account and a bot?
**A:** 
- **Your account**: You use it to chat, manage server, etc.
- **Bot account**: A program that can automate tasks, respond to commands, create channels, etc.

### Q: Can I use my personal account token?
**A:** No! Personal accounts don't have "bot tokens" - you must create a bot application. Using your personal account for automation violates Discord's Terms of Service.

### Q: Is the bot token the same as an API key?
**A:** Yes, essentially! It's Discord's way of authenticating your bot. It's called a "token" but functions like an API key.

### Q: What if I lose my token?
**A:** Just go back to the Developer Portal → Bot → Reset Token. You'll get a new one (the old one stops working).

### Q: Can I have multiple bots?
**A:** Yes! Create multiple applications, each gets its own bot and token.

### Q: Does the bot cost money?
**A:** No! Creating bots is completely free. You only pay for hosting if you want to run the bot 24/7 (but you can run it on your computer for free).

---

## 🔒 Security Tips

1. ✅ **Never commit `.env` to git** (it's already in `.gitignore`)
2. ✅ **Never share your token** in screenshots, Discord messages, or public places
3. ✅ **Reset token immediately** if you think it's compromised
4. ✅ **Use environment variables** (which we're doing with `.env`)

---

## 🆘 Troubleshooting

### "Invalid token" error
- ✅ Check that you copied the entire token (it's long!)
- ✅ Make sure there are no extra spaces
- ✅ Verify the token starts with something like `MTIz...` or `ODk...`

### "Missing Access" error
- ✅ Make sure you invited the bot to your server
- ✅ Check that bot has "Manage Channels" permission
- ✅ Make sure bot's role is high enough in role hierarchy

### Bot not appearing in server
- ✅ Check that you completed the OAuth flow
- ✅ Refresh Discord
- ✅ Check that you selected the correct server when inviting

### "Cannot find module" error
- ✅ Run `npm install` first
- ✅ Make sure you're in the correct directory

---

## 📝 Quick Checklist

- [ ] Created Discord application
- [ ] Created bot and copied token
- [ ] Enabled necessary intents
- [ ] Got server ID (Developer Mode enabled)
- [ ] Invited bot to server with correct permissions
- [ ] Created `.env` file with token and server ID
- [ ] Ran `npm install`
- [ ] Ran `npm run setup`
- [ ] Channels created successfully!

---

**That's it! You now have a bot token and can automate your Discord server setup! 🎉**

