/**
 * Remove Role Color Circles
 * 
 * Sets role colors to default/neutral so only emojis show
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

async function removeColorCircles() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        const roles = await guild.roles.fetch();
        
        // Kingdoms roles to update
        const kingdomsRoles = ['⚪ Citizen', '🟢 Apprentice', '🟣 Knight', '🟡 Noble', '🔵 Mod', '🔴 Admin'];
        
        console.log('🎨 Removing color circles from roles...\n');

        for (const roleName of kingdomsRoles) {
            const role = roles.find(r => 
                r.name === roleName || 
                r.name.includes(roleName.replace(/[^\w\s]/g, '').trim())
            );
            
            if (!role) {
                console.log(`⚠️  ${roleName} - Role not found`);
                continue;
            }

            try {
                // Set color to default (0 = default Discord color, which is essentially no color circle)
                // Or use a very light gray that blends in: 0x2F3136 (Discord's dark theme background)
                // Actually, setting to 0 should make it use default which is minimal
                await role.edit({
                    color: 0, // Default/no color
                    reason: 'Remove color circle, keep emoji only'
                });
                
                console.log(`✅ Removed color circle from ${role.name}`);
            } catch (error) {
                console.error(`❌ Failed to update ${role.name}:`, error.message);
            }
        }

        console.log('\n✅ Color circles removed!');
        console.log('   Now only emojis will show next to role names\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    removeColorCircles();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

