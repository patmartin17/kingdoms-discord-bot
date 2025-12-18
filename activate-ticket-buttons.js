/**
 * Activate Ticket Buttons Handler (Discord.js v12)
 * 
 * Simple bot for Node.js 16 compatibility
 * Discord.js v12 does NOT use undici, so no ReadableStream issues
 */

const Discord = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set');
    process.exit(1);
}

const client = new Discord.Client({
    ws: {
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGES
        ]
    }
});

client.once('ready', () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    console.log(`   Guilds: ${client.guilds.cache.size}`);
});

// Auto-assign Citizen role to new members
client.on('guildMemberAdd', async (member) => {
    try {
        console.log(`👤 New member joined: ${member.user.tag}`);
        
        // Find Citizen role (try different variations)
        const citizenRole = member.guild.roles.cache.find(r => 
            r.name === '⚪ Citizen' || 
            r.name === '👤 Citizen' ||
            r.name.toLowerCase().includes('citizen')
        );
        
        if (!citizenRole) {
            console.error(`❌ Citizen role not found! Available roles:`);
            member.guild.roles.cache.forEach(role => {
                if (!role.managed && role.name !== '@everyone') {
                    console.log(`   - ${role.name}`);
                }
            });
            return;
        }
        
        if (member.roles.cache.has(citizenRole.id)) {
            console.log(`ℹ️  ${member.user.tag} already has Citizen role`);
            return;
        }
        
        // Check if bot can manage this role (bot's role must be higher)
        const botMember = await member.guild.members.fetch(client.user.id);
        if (botMember.roles.highest.position <= citizenRole.position) {
            console.error(`❌ Bot's role is not high enough to assign Citizen role!`);
            console.error(`   Bot role position: ${botMember.roles.highest.position}`);
            console.error(`   Citizen role position: ${citizenRole.position}`);
            console.error(`   Move bot's role higher than Citizen in Server Settings → Roles`);
            return;
        }
        
        await member.roles.add(citizenRole, 'Auto-assign: Citizen role on join');
        console.log(`✅ Assigned Citizen role to ${member.user.tag}`);
    } catch (error) {
        console.error(`❌ Error assigning Citizen role to ${member.user.tag}: ${error.message}`);
        if (error.code === 50013) {
            console.error(`   Missing Permissions - Bot needs "Manage Roles" permission`);
        } else if (error.code === 50035) {
            console.error(`   Invalid Form Body - Bot's role must be higher than Citizen role`);
        }
    }
});

// Simple message handler (v12 doesn't have buttons, but bot will be online)
client.on('message', async message => {
    if (message.author.bot) return;
    
    // Simple ticket command
    if (message.content === '!ticket') {
        const guild = message.guild;
        
        // Create ticket channel
        const ticketChannel = await guild.channels.create(`ticket-${message.author.username}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                }
            ]
        });
        
        await ticketChannel.send(`Welcome ${message.author}! Staff will assist you shortly.\nType \`!close\` to close this ticket.`);
        await message.reply(`Ticket created! Go to ${ticketChannel}`);
        console.log(`✅ Created ticket for ${message.author.username}`);
    }
    
    // Close ticket command
    if (message.content === '!close' && message.channel.name.startsWith('ticket-')) {
        await message.channel.send('🔒 Closing ticket in 5 seconds...');
        setTimeout(() => {
            message.channel.delete().catch(console.error);
        }, 5000);
    }
});

client.on('error', error => {
    console.error('Discord error:', error);
});

console.log('🔌 Connecting to Discord...');
client.login(DISCORD_TOKEN);
