# Discord Bot Integration Examples

## Account Linking Bot - Basic Structure

### Technology Stack
- **Language**: Node.js (Discord.js) or Python (discord.py)
- **Database**: PostgreSQL/MySQL or MongoDB
- **API**: Express.js (Node) or Flask/FastAPI (Python)

---

## Example: Discord.js Bot Structure

### Project Structure
```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── link.js
│   │   ├── unlink.js
│   │   ├── status.js
│   │   └── rewards.js
│   ├── events/
│   │   ├── ready.js
│   │   ├── messageCreate.js
│   │   └── guildMemberAdd.js
│   ├── utils/
│   │   ├── database.js
│   │   └── codeGenerator.js
│   └── index.js
├── config.json
└── package.json
```

### Basic Bot Code (discord.js)

```javascript
// index.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.DISCORD_TOKEN);
```

### Link Command Example

```javascript
// src/commands/link.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateLinkingCode, storeLinkingCode } = require('../utils/codeGenerator');
const { checkIfLinked } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord account to your game account'),
    
    async execute(interaction) {
        // Check if already linked
        const existingLink = await checkIfLinked(interaction.user.id);
        if (existingLink) {
            return interaction.reply({
                content: `You're already linked! Game Account: ${existingLink.game_account_id}`,
                ephemeral: true
            });
        }

        // Generate unique code
        const code = generateLinkingCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store code in database
        await storeLinkingCode(interaction.user.id, code, expiresAt);

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('🔗 Account Linking')
            .setDescription(`Your linking code is: **${code}**`)
            .addFields(
                { name: '⏰ Expires In', value: '10 minutes', inline: true },
                { name: '📝 How to Link', value: '1. Go to [your website]\n2. Navigate to Account Settings\n3. Enter this code', inline: false }
            )
            .setColor(0x5865F2)
            .setFooter({ text: 'Keep this code private!' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
```

### Code Generator Utility

```javascript
// src/utils/codeGenerator.js
const crypto = require('crypto');

function generateLinkingCode() {
    // Generate 8-character alphanumeric code
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function storeLinkingCode(discordId, code, expiresAt) {
    // Store in database
    // Example with PostgreSQL:
    // await db.query(
    //     'INSERT INTO linking_codes (discord_id, code, expires_at) VALUES ($1, $2, $3)',
    //     [discordId, code, expiresAt]
    // );
}

module.exports = { generateLinkingCode, storeLinkingCode };
```

---

## Website API Integration

### Express.js API Endpoint Example

```javascript
// website-api/routes/discord.js
const express = require('express');
const router = express.Router();
const { verifyLinkingCode, linkAccounts } = require('../services/discordService');

// Verify and link account
router.post('/verify-link', async (req, res) => {
    const { code, gameAccountId } = req.body;

    try {
        // Verify code exists and is valid
        const verification = await verifyLinkingCode(code);
        
        if (!verification.valid) {
            return res.status(400).json({ 
                error: verification.reason || 'Invalid or expired code' 
            });
        }

        // Link accounts
        await linkAccounts(verification.discordId, gameAccountId);

        // Grant rewards
        await grantLinkingRewards(gameAccountId, verification.discordId);

        res.json({ 
            success: true, 
            message: 'Account linked successfully!',
            rewards: ['Starter Pack', '1000 Coins', 'VIP Badge']
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

---

## Hytale Server Plugin Integration

### Example: Hytale Plugin (Java-like syntax)

```java
// HytalePlugin.java
public class DiscordLinkPlugin extends Plugin {
    
    @Override
    public void onEnable() {
        // Register command
        registerCommand("linkdiscord", new LinkDiscordCommand());
        
        // Set up API connection to Discord bot
        setupDiscordAPI();
    }
    
    private void setupDiscordAPI() {
        // Connect to Discord bot API
        // Listen for verification requests
    }
}

// LinkDiscordCommand.java
public class LinkDiscordCommand implements CommandExecutor {
    
    @Override
    public void execute(Player player, String[] args) {
        if (args.length != 1) {
            player.sendMessage("Usage: /linkdiscord <code>");
            return;
        }
        
        String code = args[0];
        
        // Send verification request to Discord bot API
        boolean verified = verifyWithDiscordBot(player.getUUID(), code);
        
        if (verified) {
            player.sendMessage("Account linked successfully!");
            // Grant rewards
            grantRewards(player);
        } else {
            player.sendMessage("Invalid or expired code!");
        }
    }
    
    private boolean verifyWithDiscordBot(UUID playerUUID, String code) {
        // HTTP request to Discord bot API
        // POST /api/verify-code
        // Body: { code: code, gameAccountId: playerUUID }
        // Returns: { valid: true/false }
    }
    
    private void grantRewards(Player player) {
        // Give items, currency, permissions, etc.
        player.giveItem("starter_pack");
        player.addCurrency(1000);
        player.addPermission("discord.verified");
    }
}
```

---

## Database Schema

### PostgreSQL Example

```sql
-- Linking codes table
CREATE TABLE linking_codes (
    id SERIAL PRIMARY KEY,
    discord_id BIGINT NOT NULL,
    code VARCHAR(16) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Linked accounts table
CREATE TABLE linked_accounts (
    id SERIAL PRIMARY KEY,
    discord_id BIGINT UNIQUE NOT NULL,
    game_account_id VARCHAR(255) UNIQUE NOT NULL,
    linked_at TIMESTAMP DEFAULT NOW(),
    last_synced TIMESTAMP
);

-- Rewards tracking
CREATE TABLE reward_history (
    id SERIAL PRIMARY KEY,
    discord_id BIGINT NOT NULL,
    game_account_id VARCHAR(255) NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_data JSONB,
    claimed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_linking_codes_code ON linking_codes(code);
CREATE INDEX idx_linking_codes_discord ON linking_codes(discord_id);
CREATE INDEX idx_linked_accounts_discord ON linked_accounts(discord_id);
CREATE INDEX idx_linked_accounts_game ON linked_accounts(game_account_id);
```

---

## Environment Variables

### .env file example

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_server_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/discord_bot
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_bot
DB_USER=your_user
DB_PASSWORD=your_password

# Website API
WEBSITE_API_URL=https://yourwebsite.com/api
WEBSITE_API_KEY=your_api_key

# Hytale Server
HYTALE_API_URL=http://your-hytale-server:8080/api
HYTALE_API_KEY=your_hytale_api_key

# Security
JWT_SECRET=your_jwt_secret
CODE_EXPIRY_MINUTES=10
```

---

## Webhook Integration

### Discord Webhook for Announcements

```javascript
// src/utils/webhooks.js
const { WebhookClient } = require('discord.js');

const announcementWebhook = new WebhookClient({
    url: process.env.ANNOUNCEMENT_WEBHOOK_URL
});

async function sendAnnouncement(title, description, color = 0x5865F2) {
    await announcementWebhook.send({
        embeds: [{
            title,
            description,
            color,
            timestamp: new Date().toISOString()
        }]
    });
}

// Usage: When account is linked
async function notifyAccountLinked(discordId, gameAccountId) {
    await sendAnnouncement(
        '✅ Account Linked',
        `<@${discordId}> has successfully linked their account!\nGame Account: ${gameAccountId}`,
        0x00FF00
    );
}

module.exports = { sendAnnouncement, notifyAccountLinked };
```

---

## Security Best Practices

### 1. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const linkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3 // 3 attempts per 15 minutes
});

router.post('/verify-link', linkLimiter, async (req, res) => {
    // ... verification code
});
```

### 2. Input Validation
```javascript
function validateLinkingCode(code) {
    // Check format: 8 alphanumeric characters
    return /^[A-Z0-9]{8}$/.test(code);
}

function validateGameAccountId(id) {
    // UUID format or your specific format
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
```

### 3. Secure Code Generation
```javascript
const crypto = require('crypto');

function generateSecureCode() {
    // Use cryptographically secure random
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}
```

---

## Testing Checklist

- [ ] Bot responds to commands
- [ ] Linking code generation works
- [ ] Codes expire after set time
- [ ] Website can verify codes
- [ ] Hytale server can verify codes
- [ ] Rewards are granted correctly
- [ ] Duplicate linking is prevented
- [ ] Unlinking works correctly
- [ ] Rate limiting works
- [ ] Error handling is proper
- [ ] Database queries are optimized
- [ ] Webhooks send correctly

---

## Deployment

### Using PM2 (Node.js)

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start src/index.js --name discord-bot

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

### Docker Example

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "src/index.js"]
```

---

*Customize these examples to fit your specific needs!*

