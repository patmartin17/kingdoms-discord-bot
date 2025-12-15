/**
 * Create Combined Ticket Panel
 * 
 * Creates a single panel message with both General Support and Ban Appeals options
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

async function createCombinedPanel() {
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

        console.log('📝 Creating combined ticket panel...\n');

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Need Help? Create a Ticket!')
            .setDescription(
                'Select a category below to create a support ticket.\n' +
                'Our staff will respond as soon as possible!\n\n' +
                '**Available Categories:**\n' +
                '🎫 **General Support** - General questions and help\n' +
                '⚖️ **Ban Appeals** - Appeal a server ban\n\n' +
                'Click a button below to get started!'
            )
            .setColor(0x5865F2)
            .setFooter({ text: 'Response time: Usually within 24 hours' })
            .setTimestamp();

        // Create buttons for both options
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_general_support')
                    .setLabel('General Support')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticket_ban_appeal')
                    .setLabel('Ban Appeals')
                    .setEmoji('⚖️')
                    .setStyle(ButtonStyle.Danger)
            );

        // Send the panel
        const message = await ticketPanelChannel.send({
            embeds: [embed],
            components: [row]
        });

        console.log('✅ Combined ticket panel created!\n');
        console.log(`📋 Panel Message ID: ${message.id}\n`);
        console.log('⚠️  Note: These buttons need to be connected to Ticket Tool.');
        console.log('   Options:');
        console.log('   1. Configure Ticket Tool to use these button IDs');
        console.log('   2. Or I can make MakerBot handle these buttons directly\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 50013) {
            console.error('   Missing Permissions - Make sure bot can send messages');
        }
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    createCombinedPanel();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

