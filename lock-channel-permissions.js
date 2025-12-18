/**
 * Lock Channel Permissions
 * 
 * This script locks down specific channels so only admins, mods, and MakerBot
 * can send messages. Regular members can only read.
 * 
 * Channels to lock:
 * - welcome
 * - announcements
 * - updates
 * - rules
 * - server-status
 * 
 * Usage:
 *   node lock-channel-permissions.js
 */

const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
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

// Channels to lock down (only these can send messages: Admin, Mod, MakerBot)
const channelsToLock = [
    'welcome',
    'announcements',
    'updates',
    'rules',
    'server-status'
];

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
        
        // Find MakerBot
        const makerBot = guild.members.cache.get(client.user.id);
        
        console.log('📋 Roles found:');
        console.log(`   @everyone: ${everyoneRole.name}`);
        if (adminRole) console.log(`   ✅ Admin: ${adminRole.name}`);
        else console.log(`   ⚠️  Admin role not found`);
        if (modRole) console.log(`   ✅ Mod: ${modRole.name}`);
        else console.log(`   ⚠️  Mod role not found`);
        console.log(`   ✅ MakerBot: ${client.user.tag}\n`);
        
        if (!adminRole && !modRole) {
            console.error('❌ Error: Could not find Admin or Mod roles!');
            console.log('   Available roles:');
            guild.roles.cache.sort((a, b) => b.position - a.position).forEach(role => {
                if (!role.managed && role.name !== '@everyone') {
                    console.log(`      - ${role.name}`);
                }
            });
            process.exit(1);
        }
        
        // Process each channel
        const results = [];
        
        for (const channelName of channelsToLock) {
            const channel = guild.channels.cache.find(c => 
                c.name === channelName && 
                c.type === 0 // Text channel
            );
            
            if (!channel) {
                console.log(`⚠️  Channel #${channelName} not found, skipping...`);
                results.push({ channel: channelName, status: 'not found' });
                continue;
            }
            
            try {
                console.log(`🔒 Locking down #${channel.name}...`);
                
                // Set @everyone permissions: Can view, CANNOT send
                await channel.permissionOverwrites.edit(everyoneRole.id, {
                    ViewChannel: true,
                    SendMessages: false,
                    SendMessagesInThreads: false,
                    ReadMessageHistory: true,
                    AddReactions: false // Optional: prevent reactions too
                });
                console.log(`   ✅ @everyone: Read-only`);
                
                // Set Admin permissions: Can view and send
                if (adminRole) {
                    await channel.permissionOverwrites.edit(adminRole.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        SendMessagesInThreads: true,
                        ReadMessageHistory: true,
                        AddReactions: true,
                        ManageMessages: true
                    });
                    console.log(`   ✅ ${adminRole.name}: Full access`);
                }
                
                // Set Mod permissions: Can view and send
                if (modRole) {
                    await channel.permissionOverwrites.edit(modRole.id, {
                        ViewChannel: true,
                        SendMessages: true,
                        SendMessagesInThreads: true,
                        ReadMessageHistory: true,
                        AddReactions: true
                    });
                    console.log(`   ✅ ${modRole.name}: Full access`);
                }
                
                // Set MakerBot permissions: Can view and send
                await channel.permissionOverwrites.edit(client.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    SendMessagesInThreads: true,
                    ReadMessageHistory: true,
                    AddReactions: true,
                    EmbedLinks: true,
                    AttachFiles: true
                });
                console.log(`   ✅ MakerBot: Full access`);
                
                results.push({ channel: channelName, status: 'locked' });
                console.log(`   ✅ #${channel.name} locked down!\n`);
                
            } catch (error) {
                console.error(`   ❌ Error locking #${channel.name}: ${error.message}\n`);
                results.push({ channel: channelName, status: 'error', error: error.message });
            }
        }
        
        // Summary
        console.log('\n📊 Summary:');
        const locked = results.filter(r => r.status === 'locked').length;
        const notFound = results.filter(r => r.status === 'not found').length;
        const errors = results.filter(r => r.status === 'error').length;
        
        console.log(`   ✅ Successfully locked: ${locked}/${channelsToLock.length} channels`);
        if (notFound > 0) console.log(`   ⚠️  Not found: ${notFound} channels`);
        if (errors > 0) console.log(`   ❌ Errors: ${errors} channels`);
        
        console.log('\n✅ Channel permissions updated!');
        console.log('\n📝 What changed:');
        console.log('   • Regular members can only READ these channels');
        console.log('   • Admin, Mod, and MakerBot can SEND messages');
        console.log('   • All other members are read-only');
        
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

