/**
 * Create Events Channel
 * 
 * Creates an #events channel with the same permissions as #announcements
 * (read-only for members, admins/mods/MakerBot can send)
 * 
 * Usage:
 *   node create-events-channel.js
 */

const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
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
        
        console.log('📋 Roles found:');
        console.log(`   @everyone: ${everyoneRole.name}`);
        if (adminRole) console.log(`   ✅ Admin: ${adminRole.name}`);
        if (modRole) console.log(`   ✅ Mod: ${modRole.name}`);
        console.log(`   ✅ MakerBot: ${client.user.tag}\n`);
        
        // Find INFORMATION category (where announcements is)
        const infoCategory = guild.channels.cache.find(c => 
            c.type === ChannelType.GuildCategory && 
            (c.name.includes('INFORMATION') || c.name.includes('📢'))
        );
        
        if (!infoCategory) {
            console.error('❌ Error: Could not find INFORMATION category!');
            console.log('   Available categories:');
            guild.channels.cache
                .filter(c => c.type === ChannelType.GuildCategory)
                .forEach(cat => console.log(`      - ${cat.name}`));
            process.exit(1);
        }
        
        console.log(`✅ Found category: ${infoCategory.name}`);
        
        // Check if events channel already exists
        let eventsChannel = guild.channels.cache.find(c => 
            c.name === 'events' && 
            c.type === ChannelType.GuildText
        );
        
        if (eventsChannel) {
            console.log(`\n⚠️  #events channel already exists!`);
            console.log(`   Updating permissions...\n`);
        } else {
            // Create events channel
            console.log('\n📝 Creating #events channel...');
            eventsChannel = await guild.channels.create({
                name: 'events',
                type: ChannelType.GuildText,
                topic: 'Server events, competitions, and special activities',
                parent: infoCategory.id,
                permissionOverwrites: []
            });
            console.log(`   ✅ Created #events channel\n`);
        }
        
        // Set permissions (same as announcements)
        console.log('🔒 Setting permissions...');
        
        // @everyone: Can view, CANNOT send
        await eventsChannel.permissionOverwrites.edit(everyoneRole.id, {
            ViewChannel: true,
            SendMessages: false,
            SendMessagesInThreads: false,
            ReadMessageHistory: true,
            AddReactions: false
        });
        console.log(`   ✅ @everyone: Read-only`);
        
        // Admin: Full access
        if (adminRole) {
            await eventsChannel.permissionOverwrites.edit(adminRole.id, {
                ViewChannel: true,
                SendMessages: true,
                SendMessagesInThreads: true,
                ReadMessageHistory: true,
                AddReactions: true,
                ManageMessages: true
            });
            console.log(`   ✅ ${adminRole.name}: Full access`);
        }
        
        // Mod: Full access
        if (modRole) {
            await eventsChannel.permissionOverwrites.edit(modRole.id, {
                ViewChannel: true,
                SendMessages: true,
                SendMessagesInThreads: true,
                ReadMessageHistory: true,
                AddReactions: true
            });
            console.log(`   ✅ ${modRole.name}: Full access`);
        }
        
        // MakerBot: Full access
        await eventsChannel.permissionOverwrites.edit(client.user.id, {
            ViewChannel: true,
            SendMessages: true,
            SendMessagesInThreads: true,
            ReadMessageHistory: true,
            AddReactions: true,
            EmbedLinks: true,
            AttachFiles: true
        });
        console.log(`   ✅ MakerBot: Full access`);
        
        console.log(`\n✅ #events channel configured!`);
        console.log(`\n📝 Permissions:`);
        console.log(`   • Regular members: Read-only`);
        console.log(`   • Admin, Mod, MakerBot: Can send messages`);
        console.log(`\n🔗 Channel: https://discord.com/channels/${GUILD_ID}/${eventsChannel.id}`);
        
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

