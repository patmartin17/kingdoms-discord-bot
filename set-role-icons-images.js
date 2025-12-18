/**
 * Set Role Icons Using Custom Images
 * 
 * Uploads custom images as role icons
 * Works with Tier 3 server boosts!
 * 
 * Usage:
 *   1. Create an 'icons' folder in this directory
 *   2. Add your images: citizen.png, apprentice.png, knight.png, noble.png, mod.png, admin.png
 *   3. Run: node set-role-icons-images.js
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
        GatewayIntentBits.Guilds
    ]
});

// Role icon mapping - specify image file paths
// Images should be in an 'icons' folder, or provide full paths
const roleIcons = {
    'Citizen': './icons/citizen.png',      // Gray circle or custom icon
    'Apprentice': './icons/apprentice.png', // Green circle or custom icon
    'Knight': './icons/knight.png',         // Purple circle or custom icon
    'Noble': './icons/noble.png',           // Yellow circle or custom icon
    'Mod': './icons/mod.png',               // Blue circle or custom icon
    'Admin': './icons/admin.png'            // Red circle or custom icon
};

// Alternative: Use absolute paths or different locations
// const roleIcons = {
//     'Citizen': '/path/to/your/citizen-icon.png',
//     'Apprentice': '/path/to/your/apprentice-icon.png',
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

        console.log('✅ Server Boost Level confirmed! Custom images enabled!\n');

        // Check if icons folder exists
        const iconsDir = path.join(__dirname, 'icons');
        if (!fs.existsSync(iconsDir)) {
            console.log('📁 Creating icons folder...\n');
            fs.mkdirSync(iconsDir, { recursive: true });
            console.log('✅ Created ./icons/ folder\n');
            console.log('💡 Next steps:');
            console.log('   1. Add your icon images to ./icons/ folder');
            console.log('   2. Name them: citizen.png, apprentice.png, knight.png, noble.png, mod.png, admin.png');
            console.log('   3. Recommended size: 64x64px (PNG or SVG)');
            console.log('   4. Run this script again\n');
            client.destroy();
            return;
        }

        // Fetch roles
        const roles = await guild.roles.fetch();
        console.log('🎨 Setting role icons from custom images...\n');

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const [roleName, imagePath] of Object.entries(roleIcons)) {
            // Find role
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
                // Resolve image path
                const fullPath = path.isAbsolute(imagePath) 
                    ? imagePath 
                    : path.resolve(__dirname, imagePath);

                // Check if file exists
                if (!fs.existsSync(fullPath)) {
                    console.log(`⚠️  ${roleName} - Image not found: ${imagePath}`);
                    console.log(`   Expected location: ${fullPath}`);
                    skippedCount++;
                    continue;
                }

                // Read image file
                const imageBuffer = fs.readFileSync(fullPath);
                
                // Set role icon
                await role.setIcon(imageBuffer);
                console.log(`   ✅ ${roleName} - Set icon from ${imagePath}`);
                successCount++;
            } catch (error) {
                console.error(`   ❌ ${roleName} - Failed: ${error.message}`);
                if (error.message.includes('Invalid image')) {
                    console.error(`      Make sure the image is PNG, JPEG, or SVG format`);
                } else if (error.message.includes('size')) {
                    console.error(`      Image might be too large (max 256KB)`);
                }
                errorCount++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Successfully set: ${successCount}`);
        console.log(`   ⚠️  Skipped: ${skippedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);

        if (successCount > 0) {
            console.log('\n🎉 Role icons set successfully!');
            console.log('   Icons will now appear next to usernames in chat!');
        }

        if (skippedCount > 0) {
            console.log('\n💡 To add missing images:');
            console.log('   1. Create/check ./icons/ folder');
            console.log('   2. Add images: citizen.png, apprentice.png, knight.png, noble.png, mod.png, admin.png');
            console.log('   3. Recommended: 64x64px PNG files');
            console.log('   4. Run this script again');
        }

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

