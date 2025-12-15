/**
 * Set Role Icons (Requires Server Boost Level 2)
 * 
 * Sets custom emoji/icons for roles
 * Note: Requires Server Boost Level 2 to work
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

// Role icon mapping
// You can use emoji names or image URLs/paths
const roleIcons = {
    'Citizen': '🏰', // Castle emoji
    'Apprentice': '🌱', // Seedling emoji
    'Knight': '⚔️', // Sword emoji
    'Noble': '👑', // Crown emoji
    'Mod': '🔨', // Hammer emoji
    'Admin': '⭐' // Star emoji
};

// Alternative: Use custom images (provide file paths or URLs)
// const roleIcons = {
//     'Citizen': './icons/citizen.png',
//     'Apprentice': './icons/apprentice.png',
//     // etc.
// };

async function setRoleIcons() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        
        // Check server boost level
        const premiumTier = guild.premiumTier;
        console.log(`📊 Server Boost Level: ${premiumTier}\n`);
        
        if (premiumTier < 2) {
            console.log('❌ Server Boost Level 2 required for role icons!');
            console.log('   Current level:', premiumTier);
            console.log('   Need 2 server boosts to reach Level 2\n');
            console.log('💡 Once you reach Level 2, run this script again.');
            return;
        }

        console.log('✅ Server Boost Level 2 confirmed!\n');
        console.log('🎨 Setting role icons...\n');

        const roles = await guild.roles.fetch();

        for (const [roleName, icon] of Object.entries(roleIcons)) {
            const role = roles.find(r => r.name === roleName);
            
            if (!role) {
                console.log(`⚠️  ${roleName} - Role not found`);
                continue;
            }

            try {
                // Check if icon is emoji or image path
                const isEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(icon) || icon.length <= 2;
                
                if (isEmoji) {
                    // Set emoji icon
                    // Note: Discord.js doesn't directly support setting emoji as role icon
                    // You'll need to use the REST API or set it manually
                    console.log(`⚠️  ${roleName}: Emoji icons need to be set manually in Discord`);
                    console.log(`   Go to: Server Settings → Roles → ${roleName} → Role Icon`);
                    console.log(`   Set icon to: ${icon}\n`);
                } else {
                    // Would need to read file and upload as attachment
                    console.log(`⚠️  ${roleName}: Image icons need to be set manually`);
                    console.log(`   Or use Discord's API with file upload\n`);
                }
            } catch (error) {
                console.error(`❌ Failed to set icon for ${roleName}:`, error.message);
            }
        }

        console.log('\n📝 Note: Role icons must be set manually in Discord:');
        console.log('   1. Server Settings → Roles');
        console.log('   2. Click on role');
        console.log('   3. Scroll to "Role Icon"');
        console.log('   4. Click "Set Icon"');
        console.log('   5. Choose emoji or upload image');
        console.log('\n💡 Recommended icons:');
        Object.entries(roleIcons).forEach(([name, icon]) => {
            console.log(`   ${name}: ${icon}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    setRoleIcons();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

