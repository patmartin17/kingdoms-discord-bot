/**
 * Send Rules Message to Discord Server
 * 
 * This script sends a formatted rules message to the #rules channel
 * using MakerBot.
 * 
 * Usage:
 *   node send-rules-message.js
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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

// Rules content
const rules = [
    {
        number: '1',
        title: 'Respect All Members',
        description: 'Treat everyone with kindness and respect. Harassment, bullying, discrimination, or hate speech of any kind will not be tolerated. This includes but is not limited to racism, sexism, homophobia, and transphobia.'
    },
    {
        number: '2',
        title: 'No Spam or Flooding',
        description: 'Do not spam messages, emojis, reactions, or links. Avoid sending multiple messages in quick succession. Keep conversations relevant and meaningful. Excessive caps lock, repeated messages, or message flooding will result in action.'
    },
    {
        number: '3',
        title: 'Follow Discord Terms of Service',
        description: 'All Discord Terms of Service and Community Guidelines must be followed. Violations of Discord\'s ToS will result in immediate removal from the server.'
    },
    {
        number: '4',
        title: 'Keep Content Appropriate',
        description: 'No NSFW, explicit, or inappropriate content. This includes images, links, discussions, or any material that is sexual, violent, or otherwise inappropriate for a general audience. Keep the server safe for all ages.'
    },
    {
        number: '5',
        title: 'Use the Correct Channels',
        description: 'Post content in the appropriate channels. Read channel descriptions and topic pins before posting. Off-topic discussions belong in #off-topic. Respect channel purposes and staff guidance.'
    },
    {
        number: '6',
        title: 'No Unauthorized Advertising',
        description: 'Do not advertise other Discord servers, services, products, or social media without explicit staff permission. Self-promotion in designated channels is allowed, but excessive promotion is considered spam.'
    },
    {
        number: '7',
        title: 'No Cheating, Exploiting, or Hacking',
        description: 'Do not discuss, share, promote, or use cheats, exploits, hacks, or any unauthorized modifications for the Hytale server. This includes duping, glitch abuse, or any method that gives unfair advantages.'
    },
    {
        number: '8',
        title: 'Respect Staff Decisions',
        description: 'Staff decisions are final. If you disagree with a moderation action, discuss it privately with staff via DM or ticket. Public arguments, backseat moderation, or challenging staff decisions in public channels is not allowed.'
    },
    {
        number: '9',
        title: 'Link Your Account',
        description: 'Link your Discord account to your Hytale account in #account-linking to receive rewards, access special features, and participate in server events. Account linking helps prevent alt accounts and ensures fair play.'
    },
    {
        number: '10',
        title: 'No Impersonation',
        description: 'Do not impersonate staff members, other users, or any public figures. Using similar usernames, avatars, or claiming to be someone else is strictly prohibited and will result in immediate action.'
    },
    {
        number: '11',
        title: 'Keep Personal Information Private',
        description: 'Do not share personal information such as addresses, phone numbers, real names, or other private details. Respect others\' privacy and do not ask for personal information from other members.'
    },
    {
        number: '12',
        title: 'No Drama or Toxicity',
        description: 'Keep drama and personal conflicts out of public channels. If you have an issue with another member, handle it privately or create a ticket. Toxic behavior, starting arguments, or creating unnecessary drama will not be tolerated.'
    },
    {
        number: '13',
        title: 'Follow Voice Channel Rules',
        description: 'In voice channels, respect others\' speaking time, avoid background noise, and use push-to-talk when possible. Do not play music, sounds, or other audio without permission. AFK in the AFK channel when away.'
    },
    {
        number: '14',
        title: 'Report Rule Violations',
        description: 'If you see someone breaking the rules, report it to staff via ticket or DM. Do not take matters into your own hands or engage in public callouts. Let staff handle moderation appropriately.'
    },
    {
        number: '15',
        title: 'Have Fun and Be Positive',
        description: 'This is a gaming community built for fun and friendship. Be friendly, help new members, share your builds and experiences, and contribute positively to the community. We\'re all here to enjoy Hytale together!'
    }
];

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}`);
        
        // Find rules channel (try multiple variations)
        let rulesChannel = guild.channels.cache.find(
            channel => channel.name === 'rules' && channel.type === 0 // 0 = text channel
        );
        
        // Try alternative names
        if (!rulesChannel) {
            rulesChannel = guild.channels.cache.find(
                channel => (channel.name.toLowerCase().includes('rule') || 
                           channel.name.toLowerCase().includes('📋')) && 
                           channel.type === 0
            );
        }
        
        if (!rulesChannel) {
            console.error('❌ Error: #rules channel not found!');
            console.log('\n   Available text channels:');
            const textChannels = guild.channels.cache
                .filter(channel => channel.type === 0)
                .sort((a, b) => a.position - b.position);
            
            textChannels.forEach(channel => {
                console.log(`      - #${channel.name} (ID: ${channel.id})`);
            });
            
            console.log('\n💡 Tip: You can specify a channel ID as an argument:');
            console.log('   node send-rules-message.js <channel-id>');
            process.exit(1);
        }
        
        console.log(`   Found channel: #${rulesChannel.name}`);
        
        // Create embed
        const rulesEmbed = new EmbedBuilder()
            .setColor(0x5865F2) // Discord blurple color
            .setTitle('📋 Server Rules')
            .setDescription('Please read and follow these rules to ensure a positive experience for everyone.')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: `Last updated • ${guild.name}` });
        
        // Add rules as fields
        rules.forEach(rule => {
            rulesEmbed.addFields({
                name: `Rule ${rule.number}: ${rule.title}`,
                value: rule.description,
                inline: false
            });
        });
        
        // Add footer note
        rulesEmbed.addFields({
            name: '\u200b', // Invisible field for spacing
            value: '**⚠️ Breaking these rules may result in warnings, mutes, or bans.**\n**💬 Questions? Create a ticket or contact a staff member.**',
            inline: false
        });
        
        // Send message
        console.log('\n📤 Sending rules message...');
        const message = await rulesChannel.send({ embeds: [rulesEmbed] });
        
        console.log('✅ Rules message sent successfully!');
        console.log(`   Message ID: ${message.id}`);
        console.log(`   Channel: #${rulesChannel.name}`);
        console.log(`   Link: https://discord.com/channels/${GUILD_ID}/${rulesChannel.id}/${message.id}`);
        
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

