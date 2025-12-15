/**
 * Discord Server Roles & Permissions Setup Script
 * 
 * Automatically creates roles, sets up hierarchy, and configures permissions
 * for your Discord server.
 * 
 * Usage:
 * node setup-roles.js
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
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Role structure definition
// Roles are created from bottom to top (lowest to highest in hierarchy)
const roleStructure = [
    {
        name: 'Muted',
        color: '#808080', // Gray
        permissions: {
            // No permissions - can't do anything
            ViewChannel: false,
            SendMessages: false,
            Connect: false
        },
        mentionable: false,
        hoist: false, // Don't show separately in member list
        position: 0 // Lowest position
    },
    {
        name: 'Member',
        color: '#5865F2', // Discord blurple
        permissions: {
            // Basic member permissions
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            Connect: true,
            Speak: true,
            UseVAD: true
        },
        mentionable: false,
        hoist: false,
        position: 1
    },
    {
        name: 'Verified',
        color: '#57F287', // Green
        permissions: {
            // Same as Member, but this role is for linked accounts
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            Connect: true,
            Speak: true
        },
        mentionable: false,
        hoist: true, // Show separately in member list
        position: 2
    },
    {
        name: 'VIP',
        color: '#FEE75C', // Gold/Yellow
        permissions: {
            // VIP perks
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            Connect: true,
            Speak: true,
            PrioritySpeaker: true, // Can speak over others
            AttachFiles: true,
            EmbedLinks: true
        },
        mentionable: true,
        hoist: true,
        position: 3
    },
    {
        name: 'Support Staff',
        color: '#EB459E', // Pink
        permissions: {
            // Can handle tickets and help users
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true, // Can delete messages
            EmbedLinks: true,
            AttachFiles: true,
            Connect: true,
            Speak: true,
            UseExternalEmojis: true
        },
        mentionable: true,
        hoist: true,
        position: 4
    },
    {
        name: 'Moderator',
        color: '#ED4245', // Red
        permissions: {
            // Full moderation powers
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
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
            BanMembers: false, // Can't ban (Admin only)
            UseExternalEmojis: true
        },
        mentionable: true,
        hoist: true,
        position: 5
    },
    {
        name: 'Administrator',
        color: '#5865F2', // Discord blurple
        permissions: {
            // Almost all permissions except dangerous ones
            Administrator: false, // We'll set specific perms instead
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
            ManageChannels: true,
            ManageRoles: true, // Can manage roles
            ManageGuild: true, // Can manage server
            EmbedLinks: true,
            AttachFiles: true,
            Connect: true,
            Speak: true,
            MuteMembers: true,
            DeafenMembers: true,
            MoveMembers: true,
            ManageNicknames: true,
            KickMembers: true,
            BanMembers: true,
            UseExternalEmojis: true
        },
        mentionable: true,
        hoist: true,
        position: 6
    },
    {
        name: 'Owner',
        color: '#FF0000', // Red
        permissions: {
            // Full control
            Administrator: true // Full admin access
        },
        mentionable: true,
        hoist: true,
        position: 7 // Highest position
    }
];

async function setupRoles() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`👥 Setting up roles for server: ${guild.name}\n`);

        // Get existing roles
        const existingRoles = await guild.roles.fetch();
        const createdRoles = [];
        const updatedRoles = [];

        // Create roles from bottom to top (lowest to highest)
        for (const roleData of roleStructure) {
            try {
                // Check if role already exists
                let role = existingRoles.find(r => r.name === roleData.name);

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
                        color: roleData.color,
                        permissions: permissions,
                        mentionable: roleData.mentionable,
                        hoist: roleData.hoist
                    });

                    updatedRoles.push(role);
                    console.log(`   ✅ Updated role: ${roleData.name}`);
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
                        color: roleData.color,
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
            const aPos = roleStructure.find(r => r.name === a.name)?.position || 0;
            const bPos = roleStructure.find(r => r.name === b.name) || 0;
            return bPos - aPos; // Highest first
        });

        // Set positions (Discord requires setting from highest to lowest)
        for (let i = 0; i < sortedRoles.length; i++) {
            try {
                const role = sortedRoles[i];
                const roleData = roleStructure.find(r => r.name === role.name);
                
                // Calculate position (Discord positions start from 1, @everyone is 0)
                // Higher number = higher in list
                const position = roleData ? roleData.position + 1 : i + 1;
                
                await role.setPosition(position, { reason: 'Auto-setup: Role hierarchy' });
                console.log(`   ✅ Set position for ${role.name}: ${position}`);
            } catch (error) {
                console.error(`   ❌ Failed to set position for ${sortedRoles[i].name}:`, error.message);
            }
        }

        console.log('\n✅ Role setup complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Roles created: ${createdRoles.length}`);
        console.log(`   - Roles updated: ${updatedRoles.length}`);
        console.log(`   - Total roles configured: ${createdRoles.length + updatedRoles.length}`);
        console.log('\n📝 Role Hierarchy (lowest to highest):');
        roleStructure.forEach((role, index) => {
            console.log(`   ${index + 1}. ${role.name} (${role.color})`);
        });
        console.log('\n🎯 Next steps:');
        console.log('   1. Assign roles to users manually');
        console.log('   2. Set up auto-role bots (MEE6, Dyno) to assign "Member" role on join');
        console.log('   3. Configure your account linking bot to assign "Verified" role');
        console.log('   4. Review and adjust permissions as needed');
        console.log('\n🎉 Your Discord server roles are ready!');

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

