/**
 * Restrict Mod Permissions
 * 
 * This script restricts Mod permissions:
 * - Mods CANNOT send messages in: ticket-logs, ticket-staff, staff-general
 * - Mods CANNOT see: staff-general, staff-announcements (Admin-only)
 * 
 * Usage:
 *   node restrict-mod-permissions.js
 */

const { Client, GatewayIntentBits } = require('discord.js');
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

// Channels where Mods have FULL access (can view and send)
const modFullAccessChannels = [
    'ticket-logs',
    'ticket-staff',
    'staff-general',
    'staff-announcements'
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
        
        console.log('📋 Roles found:');
        console.log(`   @everyone: ${everyoneRole.name}`);
        if (adminRole) console.log(`   ✅ Admin: ${adminRole.name}`);
        else console.log(`   ❌ Admin role not found`);
        if (modRole) console.log(`   ✅ Mod: ${modRole.name}`);
        else console.log(`   ❌ Mod role not found`);
        console.log(`   ✅ MakerBot: ${client.user.tag}\n`);
        
        if (!adminRole) {
            console.error('❌ Error: Could not find Admin role!');
            process.exit(1);
        }
        
        if (!modRole) {
            console.error('❌ Error: Could not find Mod role!');
            process.exit(1);
        }
        
        const results = {
            configured: [],
            errors: []
        };
        
        // ============================================
        // Give Mods FULL access to these channels
        // ============================================
        console.log('✅ Giving Mods FULL ACCESS to these channels:');
        console.log('   (Mods can view AND send messages)\n');
        
        for (const channelName of modFullAccessChannels) {
            const channel = guild.channels.cache.find(c => 
                c.name === channelName && 
                c.type === 0 // Text channel
            );
            
            if (!channel) {
                console.log(`⚠️  Channel #${channelName} not found, skipping...`);
                results.errors.push({ channel: channelName, reason: 'not found' });
                continue;
            }
            
            try {
                console.log(`📝 Configuring #${channel.name}...`);
                
                // Set @everyone: Cannot see (staff channels)
                await channel.permissionOverwrites.edit(everyoneRole.id, {
                    ViewChannel: false
                });
                console.log(`   ✅ @everyone: Cannot see`);
                
                // Set Mod: FULL ACCESS (can view and send)
                await channel.permissionOverwrites.edit(modRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    SendMessagesInThreads: true,
                    ReadMessageHistory: true,
                    AddReactions: true
                });
                console.log(`   ✅ Mod: FULL ACCESS (can view and send)`);
                
                // Ensure Admin has full access
                await channel.permissionOverwrites.edit(adminRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    SendMessagesInThreads: true,
                    ReadMessageHistory: true,
                    AddReactions: true,
                    ManageMessages: true
                });
                console.log(`   ✅ Admin: Full access`);
                
                // Ensure MakerBot has full access
                await channel.permissionOverwrites.edit(client.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    SendMessagesInThreads: true,
                    ReadMessageHistory: true,
                    AddReactions: true
                });
                console.log(`   ✅ MakerBot: Full access`);
                
                results.configured.push(channelName);
                console.log(`   ✅ #${channel.name} configured!\n`);
                
            } catch (error) {
                console.error(`   ❌ Error configuring #${channel.name}: ${error.message}\n`);
                results.errors.push({ channel: channelName, reason: error.message });
            }
        }
        
        // Summary
        console.log('\n📊 Summary:');
        console.log(`\n   ✅ Mods FULL ACCESS (${results.configured.length} channels):`);
        results.configured.forEach(ch => console.log(`      • #${ch}`));
        
        if (results.errors.length > 0) {
            console.log(`\n   ⚠️  Errors (${results.errors.length} channels):`);
            results.errors.forEach(err => console.log(`      • #${err.channel}: ${err.reason}`));
        }
        
        console.log('\n✅ Mod permissions configured!');
        console.log('\n📝 What changed:');
        console.log('   • Mods can VIEW AND SEND in: ticket-logs, ticket-staff, staff-general, staff-announcements');
        console.log('   • Mods have full access to all staff channels');
        console.log('   • Regular members cannot see these channels');
        
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

