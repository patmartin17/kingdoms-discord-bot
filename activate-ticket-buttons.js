/**
 * Activate Ticket Buttons Handler
 * 
 * Makes the ticket panel buttons functional
 * Handles button clicks and creates tickets
 */

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set in .env file');
    process.exit(1);
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Ticket categories
const ticketCategories = {
    'ticket_general_support': { 
        name: 'General Support', 
        emoji: '🎫', 
        color: 0x5865F2,
        description: 'General questions and help'
    },
    'ticket_ban_appeal': { 
        name: 'Ban Appeals', 
        emoji: '⚖️', 
        color: 0xED4245,
        description: 'Appeal a server ban'
    }
};

// Store active tickets
const activeTickets = new Map();

client.once('ready', () => {
    console.log('✅ Ticket Button Handler Ready!');
    console.log('   Listening for button clicks...\n');
});

// Handle button clicks
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const buttonId = interaction.customId;
    
    // Check if it's one of our ticket buttons
    if (!ticketCategories[buttonId]) return;

    await interaction.deferReply({ ephemeral: true });

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const user = interaction.user;
        const categoryInfo = ticketCategories[buttonId];

        // Check if user already has an open ticket
        const existingTicket = Array.from(activeTickets.values()).find(t => t.userId === user.id && !t.closed);
        if (existingTicket) {
            return interaction.editReply({
                content: `❌ You already have an open ticket: <#${existingTicket.channelId}>\nPlease close it before creating a new one.`
            });
        }

        // Find support category
        const supportCategory = guild.channels.cache.find(c => 
            c.name === '🎫 SUPPORT & TICKETS' || 
            c.name.includes('SUPPORT') ||
            c.name.includes('TICKETS')
        );

        // Create ticket channel
        const ticketChannel = await guild.channels.create(`ticket-${user.username.toLowerCase().slice(0, 10)}-${Date.now().toString().slice(-4)}`, {
            type: 'GUILD_TEXT',
            parent: supportCategory?.id,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: user.id,
                    allow: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                        Permissions.FLAGS.READ_MESSAGE_HISTORY,
                        Permissions.FLAGS.ATTACH_FILES
                    ]
                },
                {
                    id: client.user.id,
                    allow: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                        Permissions.FLAGS.READ_MESSAGE_HISTORY,
                        Permissions.FLAGS.MANAGE_MESSAGES
                    ]
                }
            ]
        });

        // Add staff roles
        const modRole = guild.roles.cache.find(r => r.name === 'Mod');
        const adminRole = guild.roles.cache.find(r => r.name === 'Admin');
        
        if (modRole) {
            await ticketChannel.permissionOverwrites.edit(modRole.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true
            });
        }
        
        if (adminRole) {
            await ticketChannel.permissionOverwrites.edit(adminRole.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true
            });
        }

        // Store ticket info
        activeTickets.set(ticketChannel.id, {
            userId: user.id,
            channelId: ticketChannel.id,
            category: buttonId,
            createdAt: new Date(),
            closed: false
        });

        // Send welcome message
        const welcomeEmbed = new MessageEmbed()
            .setTitle(`${categoryInfo.emoji} ${categoryInfo.name}`)
            .setDescription(
                `Hello ${user}, welcome to your support ticket!\n\n` +
                `**Category:** ${categoryInfo.name}\n` +
                `**Description:** ${categoryInfo.description}\n` +
                `**Created:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `Please describe your issue and our staff will help you soon.\n\n` +
                `Click the button below to close this ticket when resolved.`
            )
            .setColor(categoryInfo.color)
            .setFooter(`Ticket ID: ${ticketChannel.id.slice(-6)}`)
            .setTimestamp();

        const closeButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`close_ticket_${ticketChannel.id}`)
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle('DANGER')
            );

        const staffMention = `${modRole ? `<@&${modRole.id}>` : ''} ${adminRole ? `<@&${adminRole.id}>` : ''}`.trim();

        await ticketChannel.send({
            content: `${user} ${staffMention}`,
            embeds: [welcomeEmbed],
            components: [closeButton]
        });

        await interaction.editReply({
            content: `✅ Ticket created! Go to <#${ticketChannel.id}>`
        });

        console.log(`✅ Created ${categoryInfo.name} ticket: ${ticketChannel.name} for ${user.username}`);

    } catch (error) {
        console.error('❌ Error creating ticket:', error);
        await interaction.editReply({
            content: '❌ Failed to create ticket. Please try again or contact an admin.'
        });
    }
});

// Handle close button
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() || !interaction.customId.startsWith('close_ticket_')) return;

    const channelId = interaction.customId.replace('close_ticket_', '');
    const ticket = activeTickets.get(channelId);

    if (!ticket) {
        return interaction.reply({ content: '❌ Ticket not found', ephemeral: true });
    }

    // Check permissions
    const hasPermission = interaction.user.id === ticket.userId || 
        interaction.member.roles.cache.some(r => ['Mod', 'Admin'].includes(r.name));

    if (!hasPermission) {
        return interaction.reply({ 
            content: '❌ You don\'t have permission to close this ticket', 
            ephemeral: true 
        });
    }

    await interaction.deferReply();

    try {
        const channel = await client.channels.fetch(channelId);
        
        // Mark as closed
        ticket.closed = true;
        activeTickets.set(channelId, ticket);

        // Send closing message
        const closeEmbed = new MessageEmbed()
            .setTitle('🔒 Ticket Closed')
            .setDescription(`This ticket has been closed by ${interaction.user}`)
            .setColor(0xED4245)
            .setTimestamp();

        await channel.send({ embeds: [closeEmbed] });
        await channel.send('⏳ This channel will be deleted in 10 seconds...');

        await interaction.editReply({ content: '✅ Ticket closed! Channel will be deleted shortly.' });

        // Delete channel after delay
        setTimeout(async () => {
            try {
                await channel.delete();
                activeTickets.delete(channelId);
                console.log(`✅ Deleted ticket channel: ${channel.name}`);
            } catch (error) {
                console.error('Error deleting channel:', error);
            }
        }, 10000);

    } catch (error) {
        console.error('Error closing ticket:', error);
        await interaction.editReply({ content: '❌ Error closing ticket' });
    }
});

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

