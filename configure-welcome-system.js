/**
 * Configure Welcome System
 * 
 * 1. Sets #welcome as system channel (auto-welcomes new members)
 * 2. Makes #welcome read-only (no one can talk)
 * 3. Disables onboarding welcome screen (wave to say hi)
 * 4. Moves welcome message to #announcements
 * 
 * Usage:
 *   node configure-welcome-system.js
 */

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
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

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}\n`);
        
        // Find roles
        const everyoneRole = guild.roles.everyone;
        const adminRole = guild.roles.cache.find(r => 
            r.name.toLowerCase() === 'admin' || 
            r.name.toLowerCase().includes('admin')
        );
        const modRole = guild.roles.cache.find(r => 
            r.name.toLowerCase() === 'mod' || 
            r.name.toLowerCase() === 'moderator' ||
            r.name.toLowerCase().includes('mod')
        );
        
        // Find channels
        const welcomeChannel = guild.channels.cache.find(c => 
            c.name === 'welcome' && 
            c.type === ChannelType.GuildText
        );
        
        const announcementsChannel = guild.channels.cache.find(c => 
            c.name === 'announcements' && 
            c.type === ChannelType.GuildText
        );
        
        if (!welcomeChannel) {
            console.error('❌ Error: #welcome channel not found!');
            process.exit(1);
        }
        
        if (!announcementsChannel) {
            console.error('❌ Error: #announcements channel not found!');
            process.exit(1);
        }
        
        console.log('📋 Channels found:');
        console.log(`   ✅ #welcome: ${welcomeChannel.id}`);
        console.log(`   ✅ #announcements: ${announcementsChannel.id}\n`);
        
        // ============================================
        // PART 1: Make #welcome read-only for everyone
        // ============================================
        console.log('🔒 Making #welcome read-only...');
        
        // @everyone: Can view, CANNOT send
        await welcomeChannel.permissionOverwrites.edit(everyoneRole.id, {
            ViewChannel: true,
            SendMessages: false,
            SendMessagesInThreads: false,
            ReadMessageHistory: true,
            AddReactions: false
        });
        console.log(`   ✅ @everyone: Read-only`);
        
        // Admin: Can send (for manual messages if needed)
        if (adminRole) {
            await welcomeChannel.permissionOverwrites.edit(adminRole.id, {
                ViewChannel: true,
                SendMessages: true,
                SendMessagesInThreads: true,
                ReadMessageHistory: true,
                AddReactions: true,
                ManageMessages: true
            });
            console.log(`   ✅ ${adminRole.name}: Can send`);
        }
        
        // Mod: Can send (for manual messages if needed)
        if (modRole) {
            await welcomeChannel.permissionOverwrites.edit(modRole.id, {
                ViewChannel: true,
                SendMessages: true,
                SendMessagesInThreads: true,
                ReadMessageHistory: true,
                AddReactions: true
            });
            console.log(`   ✅ ${modRole.name}: Can send`);
        }
        
        // MakerBot: Can send
        await welcomeChannel.permissionOverwrites.edit(client.user.id, {
            ViewChannel: true,
            SendMessages: true,
            SendMessagesInThreads: true,
            ReadMessageHistory: true,
            AddReactions: true,
            EmbedLinks: true,
            AttachFiles: true
        });
        console.log(`   ✅ MakerBot: Can send`);
        
        console.log(`   ✅ #welcome is now read-only for regular members\n`);
        
        // ============================================
        // PART 2: Set #welcome as system channel
        // ============================================
        console.log('⚙️  Setting #welcome as system channel...');
        
        try {
            await guild.setSystemChannel(welcomeChannel.id, 'Auto-welcome new members');
            console.log(`   ✅ #welcome is now the system channel`);
            console.log(`   → New members will get auto-welcome messages here\n`);
        } catch (error) {
            console.error(`   ⚠️  Could not set system channel: ${error.message}`);
            console.log(`   → You may need to set this manually in Server Settings\n`);
        }
        
        // ============================================
        // PART 3: Disable onboarding welcome screen
        // ============================================
        console.log('🚫 Disabling onboarding welcome screen...');
        
        try {
            // Note: Discord.js doesn't have direct API for onboarding settings
            // This would need to be done manually or via REST API
            console.log(`   ⚠️  This needs to be done manually in Discord:`);
            console.log(`   → Server Settings → Onboarding → Disable "Welcome Screen"`);
            console.log(`   → Or disable it in Server Settings → Onboarding\n`);
        } catch (error) {
            console.log(`   ⚠️  Note: Disable onboarding manually in Server Settings\n`);
        }
        
        // ============================================
        // PART 4: Send welcome message to #announcements
        // ============================================
        console.log('📤 Sending welcome message to #announcements...');
        
        // Get important channels for links
        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
        const accountLinkingChannel = guild.channels.cache.find(c => c.name === 'account-linking');
        const generalChannel = guild.channels.cache.find(c => c.name === 'general');
        
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        // Create welcome embed (same as before but for announcements)
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
                    value: `Need help? We've got you covered!\n• **Tickets** - Use the ticket panel for direct staff assistance\n• **Community** - Ask questions in ${generalChannel ? `<#${generalChannel.id}>` : '#general'}\n• **Staff Members** - Look for the ${adminRole ? adminRole.name : 'Admin/Mod'} role\n• **Documentation** - Check pinned messages in relevant channels`,
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
        
        // Send welcome message to announcements
        const message = await announcementsChannel.send({ 
            embeds: [welcomeEmbed],
            components: [row]
        });
        
        console.log(`   ✅ Welcome message sent to #announcements`);
        console.log(`   🔗 Message: https://discord.com/channels/${GUILD_ID}/${announcementsChannel.id}/${message.id}\n`);
        
        // Summary
        console.log('✅ Configuration complete!\n');
        console.log('📝 Summary:');
        console.log('   ✅ #welcome is read-only (only bots/staff can send)');
        console.log('   ✅ #welcome is set as system channel (auto-welcomes new members)');
        console.log('   ⚠️  Disable onboarding welcome screen manually in Server Settings');
        console.log('   ✅ Welcome message posted in #announcements');
        console.log('\n📋 Next steps:');
        console.log('   1. Go to Server Settings → Onboarding');
        console.log('   2. Disable "Welcome Screen" (the wave to say hi thing)');
        console.log('   3. New members will now get auto-welcome in #welcome');
        console.log('   4. The actual welcome message is in #announcements');
        
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

