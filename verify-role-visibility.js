/**
 * Verify Role Visibility in Chat
 * 
 * Checks if roles are properly configured to show in chat
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

async function verifyRoleVisibility() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`🔍 Checking role visibility for server: ${guild.name}\n`);

        // Get all roles
        const roles = await guild.roles.fetch();
        const kingdomsRoles = ['👤 Citizen', '⚔️ Knight', '🔨 Mod', '⭐ Admin'];

        console.log('📊 Role Visibility Check:\n');

        for (const roleName of kingdomsRoles) {
            const role = roles.find(r => r.name === roleName || r.name.includes(roleName.replace(/[^\w\s]/g, '').trim()));
            
            if (!role) {
                console.log(`❌ ${roleName} - Role not found`);
                continue;
            }

            const issues = [];
            
            // Check if hoisted
            if (!role.hoist) {
                issues.push('Not hoisted (won\'t show separately)');
            }
            
            // Check if has color
            if (role.color === 0) {
                issues.push('No color set');
            }
            
            // Check position (should be above @everyone)
            const everyoneRole = guild.roles.everyone;
            if (role.position <= everyoneRole.position) {
                issues.push('Position too low (below @everyone)');
            }

            // Check if mentionable (for Mod/Admin)
            if ((roleName.includes('Mod') || roleName.includes('Admin')) && !role.mentionable) {
                issues.push('Not mentionable (should be for staff)');
            }

            if (issues.length === 0) {
                console.log(`✅ ${role.name}`);
                console.log(`   Color: #${role.color.toString(16).padStart(6, '0').toUpperCase()}`);
                console.log(`   Position: ${role.position}`);
                console.log(`   Hoisted: Yes`);
                console.log(`   Mentionable: ${role.mentionable ? 'Yes' : 'No'}`);
            } else {
                console.log(`⚠️  ${role.name}`);
                issues.forEach(issue => console.log(`   - ${issue}`));
            }
            console.log('');
        }

        console.log('💡 Tips:');
        console.log('   - Role colors show automatically in chat');
        console.log('   - Make sure roles are "hoisted" to show separately');
        console.log('   - Role icons require Server Boost Level 2');
        console.log('   - To add icons: Server Settings → Roles → Role Icon');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

// Run the check
console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    verifyRoleVisibility();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

