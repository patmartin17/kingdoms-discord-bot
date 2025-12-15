/**
 * Custom Ticket System for MakerBot
 * 
 * Creates a fully functional ticket system using MakerBot
 * This gives you full control and can be automated!
 */

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
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
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Ticket categories
const ticketCategories = {
    'general': { name: 'General Support', emoji: '🎫', color: 0x5865F2 },
    'account': { name: 'Account Issues', emoji: '🔗', color: 0x57F287 },
    'bug': { name: 'Bug Reports', emoji: '🐛', color: 0xFEE75C },
    'ban': { name: 'Ban Appeals', emoji: '⚖️', color: 0xED4245 },
    'staff': { name: 'Staff Application', emoji: '👥', color: 0x9B59B6 }
};

// Store active tickets
const activeTickets = new Map();

client.once('ready', () => {
    console.log('✅ MakerBot Ticket System Ready!');
    createTicketPanel();
});

async function createTicketPanel() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channels = await guild.channels.fetch();
        const ticketPanelChannel = channels.find(c => c.name === 'ticket-panel');
        
        if (!ticketPanelChannel) {
            console.log('❌ #ticket-panel channel not found');
            return;
        }

        // Check if panel already exists
        const messages = await ticketPanelChannel.messages.fetch({ limit: 10 });
        const existingPanel = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0);
        
        if (existingPanel) {
            console.log('✅ Ticket panel already exists');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎫 Need Help? Create a Ticket!')
            .setDescription(
                'Select a category below to create a support ticket.\n' +
                'Our staff will respond as soon as possible!\n\n' +
                '**Categories:**\n' +
                '🎫 **General Support** - General questions\n' +
                '🔗 **Account Issues** - Account linking problems\n' +
                '🐛 **Bug Reports** - Report bugs\n' +
                '⚖️ **Ban Appeals** - Appeal a ban\n' +
                '👥 **Staff Application** - Apply for staff'
            )
            .setColor(0x5865F2)
            .setFooter({ text: 'Response time: Usually within 24 hours' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_general')
                    .setLabel('General Support')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticket_account')
                    .setLabel('Account Issues')
                    .setEmoji('🔗')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticket_bug')
                    .setLabel('Bug Reports')
                    .setEmoji('🐛')
                    .setStyle(ButtonStyle.Primary)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_ban')
                    .setLabel('Ban Appeals')
                    .setEmoji('⚖️')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('ticket_staff')
                    .setLabel('Staff Application')
                    .setEmoji('👥')
                    .setStyle(ButtonStyle.Success)
            );

        await ticketPanelChannel.send({
            embeds: [embed],
            components: [row, row2]
        });

        console.log('✅ Ticket panel created!');
    } catch (error) {
        console.error('❌ Error creating panel:', error.message);
    }
}

// Handle button clicks
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const category = interaction.customId.replace('ticket_', '');
    if (!ticketCategories[category]) return;

    await interaction.deferReply({ ephemeral: true });

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const user = interaction.user;
        const categoryInfo = ticketCategories[category];

        // Check if user already has an open ticket
        const existingTicket = Array.from(activeTickets.values()).find(t => t.userId === user.id && !t.closed);
        if (existingTicket) {
            return interaction.editReply({
                content: `❌ You already have an open ticket: <#${existingTicket.channelId}>`
            });
        }

        // Create ticket channel
        const ticketChannel = await guild.channels.create({
            name: `ticket-${user.username.toLowerCase().slice(0, 10)}`,
            type: ChannelType.GuildText,
            parent: guild.channels.cache.find(c => c.name === '🎫 SUPPORT & TICKETS'),
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageMessages
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
                ReadMessageHistory: true
            });
        }
        
        if (adminRole) {
            await ticketChannel.permissionOverwrites.edit(adminRole.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
        }

        // Store ticket info
        activeTickets.set(ticketChannel.id, {
            userId: user.id,
            channelId: ticketChannel.id,
            category: category,
            createdAt: new Date(),
            closed: false
        });

        // Send welcome message
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`${categoryInfo.emoji} ${categoryInfo.name}`)
            .setDescription(
                `Hello ${user}, welcome to your support ticket!\n\n` +
                `**Category:** ${categoryInfo.name}\n` +
                `**Created:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `Please describe your issue and our staff will help you soon.\n\n` +
                `Use \`/close\` to close this ticket.`
            )
            .setColor(categoryInfo.color)
            .setFooter({ text: `Ticket ID: ${ticketChannel.id.slice(-6)}` });

        const closeButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`close_ticket_${ticketChannel.id}`)
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticketChannel.send({
            content: `${user} ${modRole ? `<@&${modRole.id}>` : ''} ${adminRole ? `<@&${adminRole.id}>` : ''}`,
            embeds: [welcomeEmbed],
            components: [closeButton]
        });

        await interaction.editReply({
            content: `✅ Ticket created! Go to <#${ticketChannel.id}>`
        });

        console.log(`✅ Created ticket: ${ticketChannel.name} for ${user.username}`);

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
    if (interaction.user.id !== ticket.userId && 
        !interaction.member.roles.cache.some(r => ['Mod', 'Admin'].includes(r.name))) {
        return interaction.reply({ content: '❌ You don\'t have permission to close this ticket', ephemeral: true });
    }

    await interaction.deferReply();

    try {
        const channel = await client.channels.fetch(channelId);
        
        // Mark as closed
        ticket.closed = true;
        activeTickets.set(channelId, ticket);

        // Send closing message
        const closeEmbed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closed')
            .setDescription(`This ticket has been closed by ${interaction.user}`)
            .setColor(0xED4245)
            .setTimestamp();

        await channel.send({ embeds: [closeEmbed] });
        await channel.send('This channel will be deleted in 10 seconds...');

        await interaction.editReply({ content: '✅ Ticket closed!' });

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

