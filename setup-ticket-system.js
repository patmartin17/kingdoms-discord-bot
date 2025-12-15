/**
 * Setup Ticket System for Kingdoms Server
 * 
 * Configures channels and permissions for Ticket Tool
 * Note: Ticket Tool panel must be created manually via /panel command
 */

const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
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

async function setupTicketSystem() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`🎫 Setting up ticket system for server: ${guild.name}\n`);

        // Get roles
        const roles = await guild.roles.fetch();
        const modRole = roles.find(r => r.name === 'Mod');
        const adminRole = roles.find(r => r.name === 'Admin');
        const everyoneRole = guild.roles.everyone;

        // Get Ticket Tool bot
        const ticketBot = guild.members.cache.find(m => m.user.username.toLowerCase().includes('ticket'));
        
        if (!ticketBot) {
            console.log('⚠️  Ticket Tool bot not found in server');
            console.log('   Make sure you invited Ticket Tool first!\n');
        }

        // Find or create ticket channels
        const channels = await guild.channels.fetch();
        
        // 1. Ticket Panel Channel
        let ticketPanel = channels.find(c => c.name === 'ticket-panel');
        if (ticketPanel) {
            console.log(`✅ Found #ticket-panel channel`);
            
            // Set permissions - everyone can view, only bots/staff can send
            await ticketPanel.permissionOverwrites.edit(everyoneRole.id, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true
            });

            if (modRole) {
                await ticketPanel.permissionOverwrites.edit(modRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                });
            }

            if (adminRole) {
                await ticketPanel.permissionOverwrites.edit(adminRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                });
            }

            console.log(`   ✅ Configured permissions for #ticket-panel\n`);
        } else {
            console.log(`⚠️  #ticket-panel channel not found`);
        }

        // 2. Ticket Logs Channel
        let ticketLogs = channels.find(c => c.name === 'ticket-logs');
        if (ticketLogs) {
            console.log(`✅ Found #ticket-logs channel`);
            
            // Set permissions - everyone can view, only bots can send
            await ticketLogs.permissionOverwrites.edit(everyoneRole.id, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true
            });

            if (modRole) {
                await ticketLogs.permissionOverwrites.edit(modRole.id, {
                    ViewChannel: true,
                    SendMessages: false, // Read-only for staff too
                    ReadMessageHistory: true
                });
            }

            if (adminRole) {
                await ticketLogs.permissionOverwrites.edit(adminRole.id, {
                    ViewChannel: true,
                    SendMessages: false,
                    ReadMessageHistory: true
                });
            }

            console.log(`   ✅ Configured permissions for #ticket-logs\n`);
        } else {
            console.log(`⚠️  #ticket-logs channel not found`);
        }

        // 3. Ticket Staff Channel
        let ticketStaff = channels.find(c => c.name === 'ticket-staff');
        if (ticketStaff) {
            console.log(`✅ Found #ticket-staff channel`);
            
            // Set permissions - staff only
            await ticketStaff.permissionOverwrites.edit(everyoneRole.id, {
                ViewChannel: false,
                SendMessages: false
            });

            if (modRole) {
                await ticketStaff.permissionOverwrites.edit(modRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                });
            }

            if (adminRole) {
                await ticketStaff.permissionOverwrites.edit(adminRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                });
            }

            console.log(`   ✅ Configured permissions for #ticket-staff\n`);
        } else {
            console.log(`⚠️  #ticket-staff channel not found`);
        }

        console.log('✅ Ticket system channels configured!\n');
        console.log('📝 Next Steps (Manual):');
        console.log('   1. Go to #ticket-panel channel');
        console.log('   2. Run: /panel create');
        console.log('   3. Follow the setup wizard:');
        console.log('      - Select ticket categories');
        console.log('      - Set button text and emojis');
        console.log('      - Configure staff roles (Mod, Admin)');
        console.log('   4. Configure auto-close: /config');
        console.log('   5. Test by creating a ticket!\n');
        console.log('💡 Ticket Tool Commands:');
        console.log('   /panel create - Create ticket panel');
        console.log('   /config - Configure bot settings');
        console.log('   /ticket close - Close current ticket');
        console.log('   /ticket add <user> - Add user to ticket');
        console.log('   /ticket transcript - Generate transcript\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    setupTicketSystem();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

