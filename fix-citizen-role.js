/**
 * Fix Citizen Role Visibility
 * 
 * Makes Citizen role hoisted so it shows in chat
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

async function fixCitizenRole() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        const roles = await guild.roles.fetch();
        
        const citizenRole = roles.find(r => r.name === '👤 Citizen' || r.name.includes('Citizen'));
        
        if (!citizenRole) {
            console.log('❌ Citizen role not found');
            return;
        }

        console.log(`🔧 Fixing Citizen role visibility...\n`);
        
        // Make it hoisted so it shows separately
        await citizenRole.edit({
            hoist: true,
            reason: 'Fix: Make role visible in chat'
        });

        console.log(`✅ Citizen role is now hoisted!`);
        console.log(`   Role colors will now show in chat for users with this role\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    fixCitizenRole();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

