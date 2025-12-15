/**
 * Remove Emojis and Restore Color Circles
 * 
 * Removes emojis from role names and restores colors
 */

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set in .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Role mapping: current name with emoji -> new name without emoji -> color
const roleUpdates = [
    {
        currentName: '⚪ Citizen',
        newName: 'Citizen',
        color: '#808080' // Gray
    },
    {
        currentName: '🟢 Apprentice',
        newName: 'Apprentice',
        color: '#57F287' // Green
    },
    {
        currentName: '🟣 Knight',
        newName: 'Knight',
        color: '#9B59B6' // Purple
    },
    {
        currentName: '🟡 Noble',
        newName: 'Noble',
        color: '#FEE75C' // Yellow/Gold
    },
    {
        currentName: '🔵 Mod',
        newName: 'Mod',
        color: '#3498DB' // Blue
    },
    {
        currentName: '🔴 Admin',
        newName: 'Admin',
        color: '#E74C3C' // Red
    }
];

async function removeEmojisRestoreColors() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        const roles = await guild.roles.fetch();
        
        console.log('🎨 Removing emojis and restoring color circles...\n');

        for (const update of roleUpdates) {
            // Find role by current name (with emoji) or by text part
            const role = roles.find(r => 
                r.name === update.currentName || 
                r.name.includes(update.currentName.replace(/[^\w\s]/g, '').trim())
            );
            
            if (!role) {
                console.log(`⚠️  ${update.currentName} - Role not found`);
                continue;
            }

            try {
                // Remove emoji and restore color
                await role.edit({
                    name: update.newName,
                    color: parseInt(update.color.replace('#', ''), 16),
                    reason: 'Remove emoji, restore color circle'
                });
                
                console.log(`✅ Updated ${update.currentName} → ${update.newName} (${update.color})`);
            } catch (error) {
                console.error(`❌ Failed to update ${update.currentName}:`, error.message);
            }
        }

        console.log('\n✅ Emojis removed and colors restored!');
        console.log('   Now only colored circles will show (no emojis)\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    removeEmojisRestoreColors();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

