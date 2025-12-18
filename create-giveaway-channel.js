/**
 * Create Giveaway Channel
 * 
 * Creates a #giveaway channel where only admins can send messages
 * (read-only for everyone else)
 * 
 * Usage:
 *   node create-giveaway-channel.js
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
        
        console.log('📋 Roles found:');
        console.log(`   @everyone: ${everyoneRole.name}`);
        if (adminRole) console.log(`   ✅ Admin: ${adminRole.name}`);
        else console.log(`   ❌ Admin role not found`);
        console.log(`   ✅ MakerBot: ${client.user.tag}\n`);
        
        if (!adminRole) {
            console.error('❌ Error: Could not find Admin role!');
            process.exit(1);
        }
        
        // Find INFORMATION category (or create in general area)
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
        
        // Check if giveaway channel already exists
        let giveawayChannel = guild.channels.cache.find(c => 
            c.name === 'giveaway' && 
            c.type === ChannelType.GuildText
        );
        
        if (giveawayChannel) {
            console.log(`\n⚠️  #giveaway channel already exists!`);
            console.log(`   Updating permissions...\n`);
        } else {
            // Create giveaway channel
            console.log('\n📝 Creating #giveaway channel...');
            giveawayChannel = await guild.channels.create({
                name: 'giveaway',
                type: ChannelType.GuildText,
                topic: 'Server giveaways and contests - Only admins can post here',
                parent: infoCategory.id,
                permissionOverwrites: []
            });
            console.log(`   ✅ Created #giveaway channel\n`);
        }
        
        // Set permissions
        console.log('🔒 Setting permissions...');
        
        // @everyone: Can view, CANNOT send
        await giveawayChannel.permissionOverwrites.edit(everyoneRole.id, {
            ViewChannel: true,
            SendMessages: false,
            SendMessagesInThreads: false,
            ReadMessageHistory: true,
            AddReactions: true // Allow reactions for giveaway entries
        });
        console.log(`   ✅ @everyone: Read-only (can react)`);
        
        // Admin: Full access
        await giveawayChannel.permissionOverwrites.edit(adminRole.id, {
            ViewChannel: true,
            SendMessages: true,
            SendMessagesInThreads: true,
            ReadMessageHistory: true,
            AddReactions: true,
            ManageMessages: true,
            EmbedLinks: true,
            AttachFiles: true
        });
        console.log(`   ✅ ${adminRole.name}: Full access`);
        
        // MakerBot: Full access (for potential giveaway bot integration)
        await giveawayChannel.permissionOverwrites.edit(client.user.id, {
            ViewChannel: true,
            SendMessages: true,
            SendMessagesInThreads: true,
            ReadMessageHistory: true,
            AddReactions: true,
            EmbedLinks: true,
            AttachFiles: true
        });
        console.log(`   ✅ MakerBot: Full access`);
        
        console.log(`\n✅ #giveaway channel configured!`);
        console.log(`\n📝 Permissions:`);
        console.log(`   • Regular members: Read-only (can view and react)`);
        console.log(`   • Admin: Can send messages`);
        console.log(`   • MakerBot: Can send messages`);
        console.log(`\n🔗 Channel: https://discord.com/channels/${GUILD_ID}/${giveawayChannel.id}`);
        
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

