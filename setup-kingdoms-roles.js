/**
 * Kingdoms Server - Roles & Permissions Setup
 * 
 * Creates roles for Kingdoms Hytale server:
 * - 👤 Citizen (baseline)
 * - ⚔️ Knight (verified/active)
 * - 🔨 Mod (staff)
 * - ⭐ Admin (staff)
 */

const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
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

// Kingdoms role structure (lowest to highest)
const roleStructure = [
    {
        name: '👤 Citizen',
        color: '#95A5A6', // Light Gray
        permissions: {
            // Basic member permissions - baseline for new members
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            Connect: true,
            Speak: true,
            UseVAD: true
        },
        mentionable: false,
        hoist: false, // Don't show separately in member list
        position: 0 // Lowest position
    },
    {
        name: '⚔️ Knight',
        color: '#3498DB', // Blue
        permissions: {
            // Full member permissions - for verified/active members
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            Connect: true,
            Speak: true,
            UseVAD: true,
            AttachFiles: true,
            EmbedLinks: true,
            UseExternalEmojis: true
        },
        mentionable: false,
        hoist: true, // Show separately in member list
        position: 1
    },
    {
        name: '🔨 Mod',
        color: '#E74C3C', // Red
        permissions: {
            // Moderation powers
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true, // Can delete messages
            ManageChannels: true, // Can edit channels
            EmbedLinks: true,
            AttachFiles: true,
            Connect: true,
            Speak: true,
            MuteMembers: true,
            DeafenMembers: true,
            MoveMembers: true,
            ManageNicknames: true,
            KickMembers: true,
            UseExternalEmojis: true
        },
        mentionable: true,
        hoist: true, // Show separately in member list
        position: 2
    },
    {
        name: '⭐ Admin',
        color: '#9B59B6', // Purple
        permissions: {
            // Full admin powers
            Administrator: true // Full admin access
        },
        mentionable: true,
        hoist: true, // Show separately in member list
        position: 3 // Highest position
    }
];

async function setupRoles() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`👥 Setting up Kingdoms roles for server: ${guild.name}\n`);

        // Get existing roles
        const existingRoles = await guild.roles.fetch();
        const createdRoles = [];
        const updatedRoles = [];

        // Create roles from bottom to top (lowest to highest)
        for (const roleData of roleStructure) {
            try {
                // Check if role already exists (by name, ignoring emoji)
                const roleNameWithoutEmoji = roleData.name.replace(/^[^\w\s]+/, '').trim();
                let role = existingRoles.find(r => {
                    const existingName = r.name.replace(/^[^\w\s]+/, '').trim();
                    return existingName === roleNameWithoutEmoji || r.name === roleData.name;
                });

                if (role) {
                    console.log(`⚠️  Role "${roleData.name}" already exists, updating...`);
                    
                    // Update existing role - build permissions BigInt
                    let permissions = 0n;
                    Object.entries(roleData.permissions).forEach(([perm, value]) => {
                        if (value === true && PermissionFlagsBits[perm]) {
                            permissions |= PermissionFlagsBits[perm];
                        }
                    });

                    await role.edit({
                        name: roleData.name,
                        color: parseInt(roleData.color.replace('#', ''), 16),
                        permissions: permissions,
                        mentionable: roleData.mentionable,
                        hoist: roleData.hoist,
                        reason: 'Auto-setup: Role update'
                    });

                    updatedRoles.push(role);
                    console.log(`   ✅ Updated role: ${roleData.name} (${roleData.color})`);
                } else {
                    // Create new role - build permissions BigInt
                    let permissions = 0n;
                    Object.entries(roleData.permissions).forEach(([perm, value]) => {
                        if (value === true && PermissionFlagsBits[perm]) {
                            permissions |= PermissionFlagsBits[perm];
                        }
                    });

                    role = await guild.roles.create({
                        name: roleData.name,
                        color: parseInt(roleData.color.replace('#', ''), 16),
                        permissions: permissions,
                        mentionable: roleData.mentionable,
                        hoist: roleData.hoist,
                        reason: 'Auto-setup: Role creation'
                    });

                    createdRoles.push(role);
                    console.log(`   ✅ Created role: ${roleData.name} (${roleData.color})`);
                }
            } catch (error) {
                console.error(`   ❌ Failed to create/update role "${roleData.name}":`, error.message);
            }
        }

        // Set role positions (hierarchy)
        console.log('\n📊 Setting up role hierarchy...\n');
        
        // Sort roles by position (highest first for Discord API)
        const allRoles = [...createdRoles, ...updatedRoles];
        const sortedRoles = allRoles.sort((a, b) => {
            const aPos = roleStructure.find(r => {
                const rName = r.name.replace(/^[^\w\s]+/, '').trim();
                const aName = a.name.replace(/^[^\w\s]+/, '').trim();
                return rName === aName || r.name === a.name;
            })?.position || 0;
            
            const bPos = roleStructure.find(r => {
                const rName = r.name.replace(/^[^\w\s]+/, '').trim();
                const bName = b.name.replace(/^[^\w\s]+/, '').trim();
                return rName === bName || r.name === b.name;
            })?.position || 0;
            
            return bPos - aPos; // Highest first
        });

        // Set positions (Discord requires setting from highest to lowest)
        for (let i = 0; i < sortedRoles.length; i++) {
            try {
                const role = sortedRoles[i];
                const roleData = roleStructure.find(r => {
                    const rName = r.name.replace(/^[^\w\s]+/, '').trim();
                    const roleName = role.name.replace(/^[^\w\s]+/, '').trim();
                    return rName === roleName || r.name === role.name;
                });
                
                // Calculate position (Discord positions start from 1, @everyone is 0)
                // Higher number = higher in list
                const position = roleData ? roleData.position + 1 : i + 1;
                
                await role.setPosition(position, { reason: 'Auto-setup: Role hierarchy' });
                console.log(`   ✅ Set position for ${role.name}: ${position}`);
            } catch (error) {
                console.error(`   ❌ Failed to set position for ${sortedRoles[i].name}:`, error.message);
            }
        }

        console.log('\n✅ Kingdoms role setup complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Roles created: ${createdRoles.length}`);
        console.log(`   - Roles updated: ${updatedRoles.length}`);
        console.log(`   - Total roles configured: ${createdRoles.length + updatedRoles.length}`);
        console.log('\n📝 Role Hierarchy (lowest to highest):');
        roleStructure.forEach((role, index) => {
            console.log(`   ${index + 1}. ${role.name} (${role.color})`);
        });
        console.log('\n🎯 Role Details:');
        console.log('   👤 Citizen - Baseline role for new members');
        console.log('   ⚔️ Knight - Verified/active members (full permissions)');
        console.log('   🔨 Mod - Staff with moderation powers');
        console.log('   ⭐ Admin - Full admin access');
        console.log('\n📝 Next steps:');
        console.log('   1. Assign "👤 Citizen" role to all members (or set as default)');
        console.log('   2. Set up auto-role bot to assign "👤 Citizen" on join');
        console.log('   3. Configure account linking bot to assign "⚔️ Knight" when verified');
        console.log('   4. Manually assign "🔨 Mod" and "⭐ Admin" to staff members');
        console.log('\n🎉 Your Kingdoms server roles are ready!');

    } catch (error) {
        console.error('❌ Error during setup:', error);
    } finally {
        client.destroy();
    }
}

// Run the setup
console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    setupRoles();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

