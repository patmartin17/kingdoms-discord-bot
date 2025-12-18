/**
 * Set Role Icons (Requires Server Boost Level 2+)
 * 
 * Sets custom emoji/icons for roles using Discord.js v14
 * With Tier 3, you can use custom emojis or images!
 */

const { Client, GatewayIntentBits } = require('discord.js');
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

// Role icon mapping
// Options:
// 1. Server emoji name (e.g., 'castle', 'sword') - must exist in your server
// 2. Unicode emoji (e.g., '🏰', '⚔️') - will try to find matching server emoji
// 3. Image file path (e.g., './icons/citizen.png') - must exist
// 4. null - removes icon
const roleIcons = {
    'Citizen': '⚪', // Gray circle (or use '🏰' for castle)
    'Apprentice': '🟢', // Green circle (or use '🌱' for seedling)
    'Knight': '🟣', // Purple circle (or use '⚔️' for sword)
    'Noble': '🟡', // Yellow circle (or use '👑' for crown)
    'Mod': '🔵', // Blue circle (or use '🔨' for hammer)
    'Admin': '🔴' // Red circle (or use '⭐' for star)
};

// Alternative: Use custom images (uncomment and provide paths)
// const roleIcons = {
//     'Citizen': './icons/citizen.png',
//     'Apprentice': './icons/apprentice.png',
//     'Knight': './icons/knight.png',
//     'Noble': './icons/noble.png',
//     'Mod': './icons/mod.png',
//     'Admin': './icons/admin.png'
// };

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
            console.log('💡 Once you reach Level 2, run this script again.');
            client.destroy();
            return;
        }

        console.log('✅ Server Boost Level confirmed! Role icons enabled!\n');

        // Fetch server emojis
        const emojis = await guild.emojis.fetch();
        console.log(`📦 Available Server Emojis: ${emojis.size}`);
        if (emojis.size > 0) {
            emojis.forEach(emoji => {
                console.log(`   • ${emoji.name} (${emoji.toString()}) - ID: ${emoji.id}`);
            });
        }
        console.log('');

        // Fetch roles
        const roles = await guild.roles.fetch();
        console.log('🎨 Setting role icons...\n');

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
                if (icon === null) {
                    // Remove icon
                    await role.setIcon(null);
                    console.log(`   ✅ ${roleName} - Icon removed`);
                    successCount++;
                    continue;
                }

                // Check if it's a file path
                if (icon.startsWith('./') || icon.startsWith('/') || path.extname(icon)) {
                    const iconPath = path.resolve(icon);
                    if (fs.existsSync(iconPath)) {
                        const iconBuffer = fs.readFileSync(iconPath);
                        await role.setIcon(iconBuffer);
                        console.log(`   ✅ ${roleName} - Set icon from ${icon}`);
                        successCount++;
                    } else {
                        console.log(`   ⚠️  ${roleName} - Image file not found: ${icon}`);
                        skippedCount++;
                    }
                    continue;
                }

                // Try to find matching server emoji
                let emojiToUse = null;
                
                // First, try exact name match
                emojiToUse = emojis.find(e => e.name.toLowerCase() === icon.toLowerCase());
                
                // If not found, try to find emoji that matches the unicode emoji
                if (!emojiToUse && emojis.size > 0) {
                    // For unicode emojis, we need to use them directly via REST API
                    // Discord.js doesn't support setting unicode emojis as role icons directly
                    // We'll need to use the REST API
                    console.log(`   ⚠️  ${roleName} - Unicode emoji (${icon}) needs to be set manually or converted to server emoji`);
                    console.log(`      Go to: Server Settings → Roles → ${roleName} → Role Icon → Set Icon → ${icon}`);
                    skippedCount++;
                    continue;
                }

                if (emojiToUse) {
                    // Set server emoji as icon
                    await role.setIcon(emojiToUse);
                    console.log(`   ✅ ${roleName} - Set icon to ${emojiToUse.name} ${emojiToUse.toString()}`);
                    successCount++;
                } else {
                    console.log(`   ⚠️  ${roleName} - Emoji "${icon}" not found in server`);
                    console.log(`      Options:`);
                    console.log(`      1. Upload "${icon}" as a server emoji first, then run this script again`);
                    console.log(`      2. Set manually: Server Settings → Roles → ${roleName} → Role Icon → ${icon}`);
                    skippedCount++;
                }
            } catch (error) {
                console.error(`   ❌ ${roleName} - Failed: ${error.message}`);
                errorCount++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Successfully set: ${successCount}`);
        console.log(`   ⚠️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);

        if (skippedCount > 0) {
            console.log('\n💡 For skipped roles:');
            console.log('   Option 1: Set manually in Discord');
            console.log('      Server Settings → Roles → [Role Name] → Role Icon → Set Icon');
            console.log('   Option 2: Upload emojis as server emojis first');
            console.log('      Server Settings → Emoji → Upload Emoji');
            console.log('      Then update this script with the emoji names');
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

