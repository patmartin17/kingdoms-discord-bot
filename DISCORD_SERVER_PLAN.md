# Discord Server Planning & Structure Guide

## Overview
This document outlines the complete structure, integrations, and features for a Discord server that connects to your website and Hytale server, with account linking and ticketing capabilities.

---

## 🏗️ Server Structure

### Channel Categories & Channels

#### 1. **📢 INFORMATION** (Read-only for members)
- `#welcome` - Welcome message, rules, server info
- `#announcements` - Server-wide announcements
- `#updates` - Game/website updates and patch notes
- `#rules` - Server rules and guidelines
- `#server-status` - Hytale server status (auto-updated)

#### 2. **🔗 ACCOUNT & REWARDS**
- `#account-linking` - Instructions and support for linking accounts
- `#rewards` - Reward announcements and redemption info
- `#leaderboard` - Top players/stats from Hytale server

#### 3. **💬 GENERAL CHAT**
- `#general` - Main community chat
- `#off-topic` - Casual conversation
- `#media` - Share screenshots, videos, memes
- `#suggestions` - Community suggestions and feedback

#### 4. **🎮 GAMEPLAY**
- `#hytale-discussion` - Game discussion
- `#builds-showcase` - Share builds and creations
- `#trading` - In-game trading (if applicable)
- `#looking-for-group` - Find players to team up with

#### 5. **🎤 VOICE CHANNELS**
- `🎵 AFK` - Auto-move idle users here
- `🎮 General Gaming` - Main voice channel
- `🎮 Hytale Server` - For players currently on server
- `🎮 Team Voice 1-5` - Multiple team channels (create as needed)
- `🎵 Music` - For music bots (optional)

#### 6. **🎫 SUPPORT & TICKETS**
- `#ticket-logs` - Archive of closed tickets (read-only)
- `#ticket-staff` - Staff-only channel for ticket coordination
- `#open-tickets` - Auto-created tickets appear here (or use thread system)

#### 7. **👥 STAFF**
- `#staff-general` - Staff coordination
- `#staff-announcements` - Staff-only announcements
- `#moderation-logs` - Auto-logged moderation actions

---

## 🤖 Essential Bots & Integrations

### Core Bots Needed:

#### 1. **Ticket Bot** (Choose one)
- **Ticket Tool** - Most popular, highly customizable
- **Tickets Bot** - Simple and effective
- **YAGPDB** - Multi-purpose bot with ticketing module
- **Custom Bot** - Build your own for full control

#### 2. **Moderation Bot**
- **Dyno** - Auto-moderation, custom commands
- **MEE6** - Leveling, moderation, auto-roles
- **Carl-bot** - Reaction roles, auto-moderation

#### 3. **Music Bot** (Optional)
- **Jockie Music** - High quality music streaming
- **Hydra** - Modern music bot

#### 4. **Utility Bots**
- **StatBot** - Server statistics
- **ServerStats** - Member count, server info
- **Top.gg Bot** - Server listing and voting

#### 5. **Custom Integration Bot** (YOU NEED THIS)
- **Custom Discord Bot** - For account linking, Hytale server integration
- Must connect to your website API and Hytale server API
- Handles account verification, reward distribution

---

## 🔐 Account Linking System

### How It Works:

1. **User Flow:**
   ```
   User joins Discord → Links account via bot command
   → Bot generates unique code → User enters code on website/Hytale
   → Website/Hytale verifies code → Accounts linked
   → Rewards distributed automatically
   ```

2. **Bot Commands Needed:**
   - `/link` - Generate linking code
   - `/unlink` - Unlink accounts
   - `/status` - Check link status
   - `/rewards` - View available rewards

3. **Technical Requirements:**
   - Discord Bot Token
   - Website API endpoint for verification
   - Hytale server plugin/mod for verification
   - Database to store Discord ID ↔ Game Account mappings
   - Secure code generation (time-limited, single-use)

### Example Integration Points:

**Discord Bot → Website:**
- POST `/api/discord/link` - Verify linking code
- GET `/api/discord/user/{discordId}` - Get linked account info
- POST `/api/discord/reward` - Trigger reward distribution

**Discord Bot → Hytale Server:**
- Plugin listens for verification codes
- Checks against Discord bot API
- Grants in-game rewards/permissions

---

## 🎫 Ticketing System Setup

### Recommended: Ticket Tool Bot

**Setup:**
1. Create support category
2. Configure ticket categories:
   - **General Support** - General questions
   - **Account Issues** - Account linking problems
   - **Bug Reports** - Report bugs/issues
   - **Ban Appeals** - Appeal bans
   - **Staff Application** - Apply for staff

**Features:**
- Auto-create private channels per ticket
- Assign staff roles automatically
- Auto-close after inactivity
- Transcript generation
- Ticket numbering system

**Commands:**
- `/ticket create` - Open new ticket
- `/ticket close` - Close ticket (staff)
- `/ticket add` - Add user to ticket
- `/ticket remove` - Remove user from ticket

---

## 👥 Roles & Permissions

### Role Hierarchy (Top to Bottom):

1. **Owner** - Full control
2. **Admin** - Almost full control
3. **Moderator** - Moderation powers
4. **Support Staff** - Can handle tickets
5. **Verified** - Linked their account (auto-assigned)
6. **VIP/Donator** - Special perks (if applicable)
7. **Member** - Default role
8. **Muted** - Restricted from chatting

### Auto-Roles:
- **Verified** - Assigned when account is linked
- **Member** - Assigned on join (with verification)
- **Booster** - Assigned to server boosters

---

## 🎨 Welcome & Onboarding

### Welcome Message (Embed):
```
Title: Welcome to [Server Name]!
Description: 
- Read #rules and #announcements
- Link your account in #account-linking
- Join our Hytale server: [IP]
- Get support: Create a ticket!

Fields:
- Website: [your website]
- Server IP: [Hytale server IP]
- Account Linking: Use /link command
```

### Auto-Moderation:
- Auto-delete invite links (prevent spam)
- Auto-warn for excessive caps
- Auto-timeout for spam
- Filter bad words (configurable)

---

## 📊 Server Stats & Leaderboards

### Channels to Display:
- **Member Count** - Updates automatically
- **Online Members** - Real-time count
- **Server Status** - Online/Offline indicator
- **Player Count** - From Hytale server

### Leaderboard Integration:
- Top players from Hytale server
- Most active Discord members
- Top donators/supporters

---

## 🔔 Announcements & Popups

### Types of Popups/Embeds:

1. **Welcome Popup** (DM on join)
   - Server rules
   - Account linking instructions
   - Important links

2. **Reward Notifications** (Channel embeds)
   - When user links account
   - When reward is claimed
   - Special event rewards

3. **Server Status Updates** (Auto-updates)
   - Server online/offline
   - Player count changes
   - Maintenance announcements

4. **Event Announcements**
   - Server events
   - Contests
   - Updates

---

## 🛠️ Technical Implementation

### Required APIs/Endpoints:

**Discord Bot API:**
- Discord.js (Node.js) or discord.py (Python)
- OAuth2 for account verification
- Webhooks for announcements

**Website Integration:**
- REST API endpoints
- Webhook receiver for Discord events
- Database for account mappings

**Hytale Server Integration:**
- Plugin/mod system
- API communication with Discord bot
- In-game command integration

### Database Schema (Example):
```sql
discord_accounts:
  - discord_id (BIGINT, PRIMARY KEY)
  - game_account_id (VARCHAR)
  - linking_code (VARCHAR, UNIQUE)
  - code_expires_at (TIMESTAMP)
  - linked_at (TIMESTAMP)
  - rewards_claimed (JSON)
```

---

## ✅ Setup Checklist

### Phase 1: Basic Setup
- [ ] Create Discord server
- [ ] Set up channel structure
- [ ] Configure roles and permissions
- [ ] Set up basic moderation bot
- [ ] Create welcome message

### Phase 2: Ticketing
- [ ] Install ticket bot
- [ ] Configure ticket categories
- [ ] Set up staff roles
- [ ] Test ticket creation/closure

### Phase 3: Account Linking
- [ ] Develop Discord bot
- [ ] Create website API endpoints
- [ ] Develop Hytale server plugin
- [ ] Set up database
- [ ] Test linking flow

### Phase 4: Integrations
- [ ] Connect Discord bot to website
- [ ] Connect Discord bot to Hytale server
- [ ] Set up webhooks for announcements
- [ ] Configure auto-roles
- [ ] Set up server status monitoring

### Phase 5: Polish
- [ ] Add custom emojis
- [ ] Set up server stats channels
- [ ] Configure auto-moderation
- [ ] Create help commands
- [ ] Test all features

---

## 📝 Additional Considerations

### Security:
- Use environment variables for tokens/keys
- Implement rate limiting on API endpoints
- Validate all user inputs
- Use secure code generation (cryptographically random)
- Set code expiration times (5-10 minutes)

### Scalability:
- Use a database (PostgreSQL/MySQL) for account mappings
- Implement caching for frequently accessed data
- Use message queues for async operations
- Monitor bot performance and API rate limits

### User Experience:
- Clear instructions for account linking
- Quick support response times
- Transparent reward system
- Regular community engagement
- Clear rules and guidelines

### Moderation:
- Auto-moderation for common issues
- Staff training on handling tickets
- Appeal process for bans
- Clear moderation logs

---

## 🎯 Recommended Bot Commands

### Public Commands:
- `/help` - Show available commands
- `/link` - Start account linking process
- `/status` - Check server status
- `/leaderboard` - View top players
- `/rules` - Show server rules
- `/ticket create` - Open support ticket

### Staff Commands:
- `/ban` - Ban user
- `/kick` - Kick user
- `/warn` - Warn user
- `/ticket close` - Close ticket
- `/announce` - Send announcement
- `/link-force` - Force link accounts (admin)

---

## 📚 Resources & Tools

### Discord Bot Development:
- **Discord.js** - Node.js library
- **discord.py** - Python library
- **Discord Developer Portal** - https://discord.com/developers

### Bot Hosting:
- **Heroku** - Free tier available
- **Railway** - Modern hosting
- **DigitalOcean** - VPS hosting
- **Replit** - Easy deployment

### Useful Discord Servers:
- Discord.js Official Server
- Discord API Server
- Bot Development Communities

---

## 🚀 Next Steps

1. **Start with basic structure** - Set up channels and roles
2. **Add moderation bot** - Get basic protection
3. **Set up ticketing** - Enable support system
4. **Develop custom bot** - Build account linking
5. **Test thoroughly** - Ensure everything works
6. **Launch** - Open to public with monitoring

---

*This is a living document - update as your server evolves!*

