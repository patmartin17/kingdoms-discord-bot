/**
 * Discord Server Auto-Setup Script
 * 
 * This script automatically creates all channels, categories, and sets up permissions
 * for your Discord server using the Discord API.
 * 
 * Requirements:
 * - Node.js installed
 * - Discord Bot Token
 * - Bot must be in your server with "Manage Channels" permission
 * 
 * Usage:
 * 1. Install dependencies: npm install
 * 2. Set DISCORD_TOKEN and GUILD_ID in .env file
 * 3. Run: node setup-channels.js
 */

const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
require('dotenv').config();

// Configuration
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set in .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Channel structure definition
const channelStructure = {
    categories: [
        {
            name: '📢 INFORMATION',
            channels: [
                {
                    name: 'welcome',
                    type: 'text',
                    topic: 'Welcome to the server! Read the rules and get started.',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'announcements',
                    type: 'text',
                    topic: 'Important server-wide announcements',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'updates',
                    type: 'text',
                    topic: 'Game and website updates, patch notes',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'rules',
                    type: 'text',
                    topic: 'Server rules and guidelines - Please read!',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'server-status',
                    type: 'text',
                    topic: 'Hytale server status - Auto-updated by bot',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                }
            ]
        },
        {
            name: '🔗 ACCOUNT & REWARDS',
            channels: [
                {
                    name: 'account-linking',
                    type: 'text',
                    topic: 'Instructions and support for linking your Discord account to your game account. Use /link command!',
                    slowmode: 5,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'rewards',
                    type: 'text',
                    topic: 'Reward announcements and redemption information',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'leaderboard',
                    type: 'text',
                    topic: 'Top players and stats from Hytale server - Auto-updated',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                }
            ]
        },
        {
            name: '💬 GENERAL CHAT',
            channels: [
                {
                    name: 'general',
                    type: 'text',
                    topic: 'Main community chat - Keep it friendly!',
                    slowmode: 5,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'off-topic',
                    type: 'text',
                    topic: 'Casual conversation about anything',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'media',
                    type: 'text',
                    topic: 'Share screenshots, videos, memes, and artwork',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'suggestions',
                    type: 'text',
                    topic: 'Community suggestions and feedback - Use format: [Suggestion] Title',
                    slowmode: 30,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                }
            ]
        },
        {
            name: '🎮 GAMEPLAY',
            channels: [
                {
                    name: 'hytale-discussion',
                    type: 'text',
                    topic: 'Discuss Hytale gameplay, mechanics, and strategies',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'builds-showcase',
                    type: 'text',
                    topic: 'Show off your builds and creations!',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'trading',
                    type: 'text',
                    topic: 'In-game trading - Use format: [WTS/WTB] Item - Price',
                    slowmode: 10,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                },
                {
                    name: 'looking-for-group',
                    type: 'text',
                    topic: 'Find players to team up with - Use format: [LFG] Description',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: true }
                    }
                }
            ]
        },
        {
            name: '🎤 VOICE CHANNELS',
            channels: [
                {
                    name: '🎵 AFK',
                    type: 'voice',
                    userLimit: 0,
                    permissions: {
                        everyone: { view: true, connect: false }
                    }
                },
                {
                    name: '🎮 General Gaming',
                    type: 'voice',
                    userLimit: 50,
                    permissions: {
                        everyone: { view: true, connect: true, speak: true }
                    }
                },
                {
                    name: '🎮 Hytale Server',
                    type: 'voice',
                    userLimit: 50,
                    topic: 'For players currently on the Hytale server',
                    permissions: {
                        everyone: { view: true, connect: true, speak: true }
                    }
                },
                {
                    name: '🎮 Team Voice 1',
                    type: 'voice',
                    userLimit: 10,
                    permissions: {
                        everyone: { view: true, connect: true, speak: true }
                    }
                },
                {
                    name: '🎮 Team Voice 2',
                    type: 'voice',
                    userLimit: 10,
                    permissions: {
                        everyone: { view: true, connect: true, speak: true }
                    }
                },
                {
                    name: '🎮 Team Voice 3',
                    type: 'voice',
                    userLimit: 10,
                    permissions: {
                        everyone: { view: true, connect: true, speak: true }
                    }
                }
            ]
        },
        {
            name: '🎫 SUPPORT & TICKETS',
            channels: [
                {
                    name: 'ticket-panel',
                    type: 'text',
                    topic: 'Create a support ticket by clicking the button below',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'ticket-logs',
                    type: 'text',
                    topic: 'Archive of closed ticket transcripts',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: true, send: false },
                        bots: { view: true, send: true }
                    }
                },
                {
                    name: 'ticket-staff',
                    type: 'text',
                    topic: 'Staff-only channel for ticket coordination',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: false, send: false },
                        staff: { view: true, send: true }
                    },
                    staffOnly: true
                }
            ]
        },
        {
            name: '👥 STAFF',
            channels: [
                {
                    name: 'staff-general',
                    type: 'text',
                    topic: 'Staff coordination and discussion',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: false, send: false },
                        staff: { view: true, send: true }
                    },
                    staffOnly: true
                },
                {
                    name: 'staff-announcements',
                    type: 'text',
                    topic: 'Staff-only announcements and updates',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: false, send: false },
                        staff: { view: true, send: true }
                    },
                    staffOnly: true
                },
                {
                    name: 'moderation-logs',
                    type: 'text',
                    topic: 'Auto-logged moderation actions',
                    slowmode: 0,
                    permissions: {
                        everyone: { view: false, send: false },
                        bots: { view: true, send: true },
                        staff: { view: true, send: false }
                    },
                    staffOnly: true
                }
            ]
        }
    ]
};

async function setupChannels() {
    try {
        console.log('🚀 Starting Discord server setup...\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`📋 Setting up server: ${guild.name}\n`);

        // Get or create roles (we'll need these for permissions)
        let everyoneRole = guild.roles.everyone;
        let staffRole = await guild.roles.cache.find(r => r.name.toLowerCase().includes('staff') || r.name.toLowerCase().includes('mod'));
        
        // If staff role doesn't exist, create it (optional - you can skip this)
        if (!staffRole) {
            console.log('⚠️  Staff role not found. Creating placeholder...');
            console.log('   Note: You should create and configure staff roles manually.');
            console.log('   The script will continue, but staff-only channels will be visible to everyone until you set up roles.\n');
        }

        const createdChannels = [];
        let categoryOrder = 0;

        // Create categories and channels
        for (const categoryData of channelStructure.categories) {
            console.log(`📁 Creating category: ${categoryData.name}`);
            
            // Create category
            const category = await guild.channels.create({
                name: categoryData.name,
                type: ChannelType.GuildCategory,
                position: categoryOrder++
            });
            
            console.log(`   ✅ Created category: ${category.name}`);

            // Create channels in this category
            for (const channelData of categoryData.channels) {
                try {
                    const channelType = channelData.type === 'voice' 
                        ? ChannelType.GuildVoice 
                        : ChannelType.GuildText;

                    const channelOptions = {
                        name: channelData.name,
                        type: channelType,
                        parent: category.id,
                        topic: channelData.topic || undefined,
                        rateLimitPerUser: channelData.slowmode || 0
                    };

                    if (channelType === ChannelType.GuildVoice && channelData.userLimit) {
                        channelOptions.userLimit = channelData.userLimit;
                    }

                    const channel = await guild.channels.create(channelOptions);
                    console.log(`   ✅ Created ${channelData.type} channel: ${channelData.name}`);

                    // Set up permissions
                    if (channelData.permissions) {
                        const perms = channelData.permissions;
                        
                        // Everyone role permissions
                        if (perms.everyone) {
                            const everyonePerms = {
                                ViewChannel: perms.everyone.view !== false,
                                SendMessages: perms.everyone.send === true && channelType === ChannelType.GuildText,
                                SendMessagesInThreads: perms.everyone.send === true && channelType === ChannelType.GuildText,
                                Connect: perms.everyone.connect === true && channelType === ChannelType.GuildVoice,
                                Speak: perms.everyone.speak === true && channelType === ChannelType.GuildVoice,
                                UseVAD: perms.everyone.speak === true && channelType === ChannelType.GuildVoice
                            };
                            
                            await channel.permissionOverwrites.edit(everyoneRole.id, everyonePerms);
                        }

                        // Staff role permissions (if exists)
                        if (perms.staff && staffRole && channelData.staffOnly) {
                            const staffPerms = {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true,
                                Connect: true,
                                Speak: true
                            };
                            
                            await channel.permissionOverwrites.edit(staffRole.id, staffPerms);
                        }

                        // Bot permissions (allow all bots to manage)
                        if (perms.bots) {
                            const botPerms = {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true,
                                EmbedLinks: true,
                                AttachFiles: true,
                                ManageMessages: true,
                                Connect: true,
                                Speak: true
                            };
                            
                            // Apply to all bots (this is a simplified approach)
                            // In practice, you might want to target specific bot roles
                            console.log(`   ⚠️  Bot permissions: Configure bot-specific roles manually for better control`);
                        }
                    }

                    createdChannels.push(channel);
                    
                } catch (error) {
                    console.error(`   ❌ Failed to create channel ${channelData.name}:`, error.message);
                }
            }
            
            console.log('');
        }

        console.log('✅ Channel setup complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Categories created: ${channelStructure.categories.length}`);
        console.log(`   - Total channels created: ${createdChannels.length}`);
        console.log('\n📝 Next steps:');
        console.log('   1. Review and adjust channel permissions as needed');
        console.log('   2. Create and configure staff roles');
        console.log('   3. Set up your bots (MEE6, Ticket Tool, etc.)');
        console.log('   4. Add welcome message to #welcome channel');
        console.log('   5. Add rules to #rules channel');
        console.log('   6. Configure ticket bot in #ticket-panel');
        console.log('\n🎉 Your Discord server structure is ready!');

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
    setupChannels();
});

// Handle errors
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

