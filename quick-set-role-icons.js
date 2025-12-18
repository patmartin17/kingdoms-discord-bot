/**
 * Quick Role Icons Setup Helper
 * 
 * Shows you exactly what to do to set role icons manually
 * Since Discord doesn't support Unicode emojis programmatically for role icons
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

const roleIcons = {
    'Citizen': '⚪',
    'Apprentice': '🟢',
    'Knight': '🟣',
    'Noble': '🟡',
    'Mod': '🔵',
    'Admin': '🔴'
};

client.once('ready', async () => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const roles = await guild.roles.fetch();
        
        console.log('\n🎨 Role Icons Setup Guide\n');
        console.log('═══════════════════════════════════════════════════════\n');
        console.log('📋 Quick Setup Instructions:\n');
        console.log('1. Open Discord → Your Server');
        console.log('2. Server Settings → Roles');
        console.log('3. For each role below, follow these steps:\n');
        
        let stepNum = 1;
        for (const [roleName, icon] of Object.entries(roleIcons)) {
            const role = roles.find(r => {
                const cleanName = r.name.replace(/^[^\w\s]+/, '').trim();
                return cleanName === roleName || r.name === roleName || r.name.includes(roleName);
            });
            
            if (role) {
                const hasIcon = role.icon !== null;
                const status = hasIcon ? '✅' : '⏳';
                console.log(`${status} ${stepNum}. ${roleName} (${icon})`);
                console.log(`   → Click "${roleName}" role`);
                console.log(`   → Scroll to "Role Icon"`);
                console.log(`   → Click "Set Icon"`);
                console.log(`   → Select emoji: ${icon}`);
                console.log(`   → Click "Save"\n`);
                stepNum++;
            }
        }
        
        console.log('═══════════════════════════════════════════════════════\n');
        console.log('💡 Tip: You can do all 6 roles in about 2 minutes!');
        console.log('   Just follow the steps above for each role.\n');
        console.log('✅ Once done, role icons will appear next to usernames!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
});

client.login(DISCORD_TOKEN);

