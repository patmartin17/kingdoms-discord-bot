/**
 * Create Ticket Panel Message
 * 
 * Creates a ticket panel message in #ticket-panel channel
 * This creates the visual panel - Ticket Tool will handle the actual ticket creation
 */

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        GatewayIntentBits.GuildMessages
    ]
});

async function createTicketPanel() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        const channels = await guild.channels.fetch();
        
        const ticketPanelChannel = channels.find(c => c.name === 'ticket-panel');
        
        if (!ticketPanelChannel) {
            console.log('❌ #ticket-panel channel not found');
            return;
        }

        console.log(`📝 Creating ticket panel in #ticket-panel...\n`);

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Need Help? Create a Ticket!')
            .setDescription(
                'Select a category below to create a support ticket.\n' +
                'Our staff will respond as soon as possible!\n\n' +
                '**Categories:**\n' +
                '🎫 **General Support** - General questions and help\n' +
                '🔗 **Account Issues** - Account linking problems\n' +
                '🐛 **Bug Reports** - Report bugs and issues\n' +
                '⚖️ **Ban Appeals** - Appeal a server ban\n' +
                '👥 **Staff Application** - Apply for staff positions\n\n' +
                'Click a button below to get started!'
            )
            .setColor(0x5865F2) // Discord blurple
            .setFooter({ text: 'Response time: Usually within 24 hours' })
            .setTimestamp();

        // Create buttons
        // Note: These buttons won't actually create tickets unless Ticket Tool is configured
        // But they provide a visual guide and can be used with Ticket Tool's system
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

        // Send the panel
        await ticketPanelChannel.send({
            embeds: [embed],
            components: [row, row2]
        });

        console.log('✅ Ticket panel created!\n');
        console.log('⚠️  Note: These buttons are visual only.');
        console.log('   To make them functional, you still need to run:');
        console.log('   /panel create');
        console.log('   in the #ticket-panel channel\n');
        console.log('   OR configure Ticket Tool to use these button IDs.\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 50013) {
            console.error('   Missing Permissions - Make sure bot can send messages in #ticket-panel');
        }
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    createTicketPanel();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

