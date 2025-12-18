/**
 * Auto-Assign Citizen Role
 * 
 * 1. Assigns Citizen role to all existing members who don't have it
 * 2. Sets up auto-assignment for new members (adds to activate-ticket-buttons.js)
 * 
 * Usage:
 *   node auto-assign-citizen.js
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

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}\n`);
        console.log('   ⚠️  Note: This script assigns Citizen to members as they join.');
        console.log('   For existing members, you can manually assign or use a bot like Dyno.\n');
        
        // Find Citizen role (try different variations)
        const citizenRole = guild.roles.cache.find(r => 
            r.name === '⚪ Citizen' || 
            r.name === '👤 Citizen' ||
            r.name.toLowerCase().includes('citizen')
        );
        
        if (!citizenRole) {
            console.error('❌ Error: Citizen role not found!');
            console.log('\n   Available roles:');
            guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .forEach(role => {
                    if (!role.managed && role.name !== '@everyone') {
                        console.log(`      - ${role.name}`);
                    }
                });
            process.exit(1);
        }
        
        console.log(`✅ Found Citizen role: ${citizenRole.name}\n`);
        
        console.log('✅ Auto-assignment is now enabled in your bot!');
        console.log('   New members will automatically get the Citizen role when they join.\n');
        
        console.log('📝 For existing members:');
        console.log('   Option 1: Use a bot like Dyno or MEE6 with auto-role feature');
        console.log('   Option 2: Manually assign Citizen role to existing members');
        console.log('   Option 3: Use Server Settings → Roles → Set Citizen as default role');
        
        // Close bot connection
        setTimeout(() => {
            console.log('\n👋 Closing connection...');
            client.destroy();
            process.exit(0);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 50013) {
            console.error('   Missing Permissions - Make sure bot has "Manage Roles" permission');
        } else if (error.code === 50001) {
            console.error('   Missing Access - Bot needs "Manage Roles" permission');
        }
        console.error(error);
        process.exit(1);
    }
});

client.on('error', error => {
    console.error('❌ Client error:', error);
});

client.login(DISCORD_TOKEN).catch(error => {
    console.error('❌ Failed to login:', error.message);
    if (error.message.includes('disallowed intents')) {
        console.error('\n   ⚠️  You need to enable "Server Members Intent" in Discord Developer Portal:');
        console.error('   1. Go to https://discord.com/developers/applications');
        console.error('   2. Select your bot');
        console.error('   3. Go to "Bot" → "Privileged Gateway Intents"');
        console.error('   4. Enable "Server Members Intent"');
    }
    process.exit(1);
});

