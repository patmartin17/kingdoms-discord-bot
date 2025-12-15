/**
 * Assign Admin Role Script
 * 
 * Assigns the "⭐ Admin" role to a specific user
 */

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TARGET_USERNAME = 'Patt'; // Change this if needed

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set in .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

async function assignAdminRole() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`👥 Looking for user "${TARGET_USERNAME}" in server: ${guild.name}\n`);

        // Try to find user - search in cache first, then try fetching
        let user = null;
        
        // Search in cached members
        const cachedMembers = guild.members.cache;
        user = cachedMembers.find(m => 
            !m.user.bot && (
                m.user.username.toLowerCase() === TARGET_USERNAME.toLowerCase() ||
                m.displayName?.toLowerCase() === TARGET_USERNAME.toLowerCase() ||
                m.user.globalName?.toLowerCase() === TARGET_USERNAME.toLowerCase()
            )
        );

        // If not found in cache, try searching by username
        if (!user) {
            try {
                // Try to search for the user
                const searchResults = await guild.members.search({ query: TARGET_USERNAME });
                user = searchResults.find(m => 
                    !m.user.bot && (
                        m.user.username.toLowerCase() === TARGET_USERNAME.toLowerCase() ||
                        m.displayName?.toLowerCase() === TARGET_USERNAME.toLowerCase()
                    )
                );
            } catch (error) {
                console.log('⚠️  Could not search members. Trying alternative method...\n');
            }
        }

        // Last resort: try fetching all members (requires Server Members Intent)
        if (!user) {
            try {
                const members = await guild.members.fetch();
                user = members.find(m => 
                    !m.user.bot && (
                        m.user.username.toLowerCase() === TARGET_USERNAME.toLowerCase() ||
                        m.displayName?.toLowerCase() === TARGET_USERNAME.toLowerCase() ||
                        m.user.globalName?.toLowerCase() === TARGET_USERNAME.toLowerCase()
                    )
                );
            } catch (error) {
                console.log('❌ Could not fetch members. You may need to:');
                console.log('   1. Enable "Server Members Intent" in Discord Developer Portal');
                console.log('   2. Or provide the user ID instead of username');
                console.log('\nTo get user ID:');
                console.log('   - Enable Developer Mode in Discord');
                console.log('   - Right-click user → Copy User ID');
                return;
            }
        }

        if (!user) {
            console.log('❌ User not found. Make sure:');
            console.log('   1. The username is correct (case-insensitive)');
            console.log('   2. The user is in the server');
            console.log('   3. Server Members Intent is enabled (if needed)');
            return;
        }

        console.log(`✅ Found user: ${user.user.username} (${user.user.tag})\n`);

        // Find Admin role
        const adminRole = guild.roles.cache.find(r => 
            r.name === '⭐ Admin' || 
            r.name === 'Admin' ||
            r.name.toLowerCase().includes('admin')
        );

        if (!adminRole) {
            console.log('❌ Admin role not found. Available roles:');
            guild.roles.cache.forEach(role => {
                console.log(`   - ${role.name}`);
            });
            return;
        }

        console.log(`✅ Found Admin role: ${adminRole.name}\n`);

        // Check if user already has the role
        if (user.roles.cache.has(adminRole.id)) {
            console.log(`ℹ️  User "${user.user.username}" already has the ${adminRole.name} role!`);
            return;
        }

        // Assign the role
        console.log(`🔨 Assigning ${adminRole.name} role to ${user.user.username}...`);
        await user.roles.add(adminRole, 'Auto-assign: Admin role');
        console.log(`\n✅ Successfully assigned ${adminRole.name} role to ${user.user.username}!`);
        console.log(`\n🎉 ${user.user.username} is now an Admin!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 50013) {
            console.error('   Missing Permissions - Make sure bot has "Manage Roles" permission');
        } else if (error.code === 50035) {
            console.error('   Invalid Form Body - Check role hierarchy');
        }
    } finally {
        client.destroy();
    }
}

// Run the script
console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    assignAdminRole();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

