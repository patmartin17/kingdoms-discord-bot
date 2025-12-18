/**
 * Send Welcome Message to Discord Server
 * 
 * This script sends a formatted welcome message to the #welcome channel
 * using MakerBot.
 * 
 * Usage:
 *   node send-welcome-message.js
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

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}`);
        
        // Find welcome channel (try multiple variations)
        let welcomeChannel = guild.channels.cache.find(
            channel => channel.name === 'welcome' && channel.type === 0 // 0 = text channel
        );
        
        // Try alternative names
        if (!welcomeChannel) {
            welcomeChannel = guild.channels.cache.find(
                channel => (channel.name.toLowerCase().includes('welcome') || 
                           channel.name.toLowerCase().includes('👋')) && 
                           channel.type === 0
            );
        }
        
        if (!welcomeChannel) {
            console.error('❌ Error: #welcome channel not found!');
            console.log('\n   Available text channels:');
            const textChannels = guild.channels.cache
                .filter(channel => channel.type === 0)
                .sort((a, b) => a.position - b.position);
            
            textChannels.forEach(channel => {
                console.log(`      - #${channel.name} (ID: ${channel.id})`);
            });
            
            console.log('\n💡 Tip: You can specify a channel ID as an argument:');
            console.log('   node send-welcome-message.js <channel-id>');
            process.exit(1);
        }
        
        console.log(`   Found channel: #${welcomeChannel.name}`);
        
        // Get important channels for links
        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
        const accountLinkingChannel = guild.channels.cache.find(c => c.name === 'account-linking');
        const announcementsChannel = guild.channels.cache.find(c => c.name === 'announcements');
        const generalChannel = guild.channels.cache.find(c => c.name === 'general');
        
        // Create welcome embed
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x00D9FF) // Cyan color
            .setTitle('🌟 Welcome to Riven Realms! 🌟')
            .setDescription(`**Hello there, adventurer!** 👋\n\nYou've just joined an amazing community of Hytale players. We're thrilled to have you here and can't wait to see what adventures await you!\n\n${rulesChannel ? `**📜 Start here:** Read our ${rulesChannel} before diving in!` : '**📜 Start here:** Read our rules before diving in!'}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setImage(guild.bannerURL({ dynamic: true, size: 1024 }) || null)
            .addFields(
                {
                    name: '⚡ Quick Start Guide',
                    value: `**1️⃣** Check out ${announcementsChannel ? `<#${announcementsChannel.id}>` : '#announcements'} for the latest news\n**2️⃣** Link your account in ${accountLinkingChannel ? `<#${accountLinkingChannel.id}>` : '#account-linking'} to unlock rewards\n**3️⃣** Introduce yourself in ${generalChannel ? `<#${generalChannel.id}>` : '#general'}\n**4️⃣** Explore our channels and find your place in the community!`,
                    inline: false
                },
                {
                    name: '🏰 What is Riven Realms?',
                    value: 'Riven Realms is a vibrant Hytale server where kingdoms rise, alliances form, and legends are born. Whether you\'re a builder, explorer, warrior, or trader, there\'s a place for you here. Experience custom gameplay, unique features, and a community that feels like home.',
                    inline: false
                },
                {
                    name: '🎯 What Makes Us Special?',
                    value: '✨ **Active & Friendly Community** - Meet players from around the world\n✨ **Custom Features & Events** - Regular updates and exciting competitions\n✨ **Reward System** - Earn rewards for playing and participating\n✨ **Account Integration** - Seamless connection between Discord and Hytale\n✨ **Dedicated Staff** - Helpful moderators always ready to assist',
                    inline: false
                },
                {
                    name: '📞 Getting Support',
                    value: `Need help? We've got you covered!\n• **Tickets** - Use the ticket panel for direct staff assistance\n• **Community** - Ask questions in ${generalChannel ? `<#${generalChannel.id}>` : '#general'}\n• **Staff Members** - Look for the ${guild.roles.cache.find(r => r.name.toLowerCase().includes('admin') || r.name.toLowerCase().includes('mod')) ? guild.roles.cache.find(r => r.name.toLowerCase().includes('admin') || r.name.toLowerCase().includes('mod')).name : 'Admin/Mod'} role\n• **Documentation** - Check pinned messages in relevant channels`,
                    inline: false
                },
                {
                    name: '🚀 Ready to Begin?',
                    value: `**Your journey starts now!**\n\n${rulesChannel ? `👉 Read the ${rulesChannel} to understand our community standards\n` : '👉 Read the rules to understand our community standards\n'}👉 Link your account to start earning rewards\n👉 Join the conversation and make new friends\n👉 Explore, build, and create unforgettable memories!\n\n**We're excited to see what you'll accomplish!** 🎉`,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ 
                text: `${guild.name} • Join ${guild.memberCount} other adventurers!`,
                iconURL: guild.iconURL({ dynamic: true })
            });
        
        // Create buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('📜 Read Rules')
                    .setStyle(ButtonStyle.Link)
                    .setURL(rulesChannel ? `https://discord.com/channels/${GUILD_ID}/${rulesChannel.id}` : '#'),
                new ButtonBuilder()
                    .setLabel('🔗 Link Account')
                    .setStyle(ButtonStyle.Link)
                    .setURL(accountLinkingChannel ? `https://discord.com/channels/${GUILD_ID}/${accountLinkingChannel.id}` : '#'),
                new ButtonBuilder()
                    .setLabel('💬 Say Hello')
                    .setStyle(ButtonStyle.Link)
                    .setURL(generalChannel ? `https://discord.com/channels/${GUILD_ID}/${generalChannel.id}` : `https://discord.com/channels/${GUILD_ID}`)
            );
        
        // Send message
        console.log('\n📤 Sending welcome message...');
        const message = await welcomeChannel.send({ 
            embeds: [welcomeEmbed],
            components: [row]
        });
        
        console.log('✅ Welcome message sent successfully!');
        console.log(`   Message ID: ${message.id}`);
        console.log(`   Channel: #${welcomeChannel.name}`);
        console.log(`   Link: https://discord.com/channels/${GUILD_ID}/${welcomeChannel.id}/${message.id}`);
        
        // Close bot connection
        setTimeout(() => {
            console.log('\n👋 Closing connection...');
            client.destroy();
            process.exit(0);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
});

client.on('error', error => {
    console.error('❌ Client error:', error);
});

client.login(DISCORD_TOKEN).catch(error => {
    console.error('❌ Failed to login:', error.message);
    process.exit(1);
});

