/**
 * Test bot connection - check if it can connect to Discord
 */

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

console.log('🔍 Testing bot connection...\n');

// Check env vars
console.log('Environment Variables:');
console.log(`  GUILD_ID: ${GUILD_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`  DISCORD_TOKEN: ${DISCORD_TOKEN ? '✅ Set (' + DISCORD_TOKEN.substring(0, 20) + '...)' : '❌ Missing'}\n`);

if (!GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Error: GUILD_ID and DISCORD_TOKEN must be set');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('✅ Bot connected successfully!');
    console.log(`   Logged in as: ${client.user.tag}`);
    console.log(`   Bot ID: ${client.user.id}`);
    console.log(`   Guilds: ${client.guilds.cache.size}`);
    
    const guild = client.guilds.cache.get(GUILD_ID);
    if (guild) {
        console.log(`   ✅ Found your server: ${guild.name}`);
    } else {
        console.log(`   ⚠️  Server ${GUILD_ID} not found (bot might not be in server)`);
    }
    
    console.log('\n✅ Connection test successful!');
    process.exit(0);
});

client.on('error', error => {
    console.error('❌ Discord client error:', error);
    process.exit(1);
});

client.on('disconnect', () => {
    console.log('⚠️  Bot disconnected');
});

process.on('unhandledRejection', error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN).catch(error => {
    console.error('❌ Failed to login:', error.message);
    if (error.message.includes('Invalid token')) {
        console.error('   → Check your DISCORD_TOKEN in Railway dashboard');
    }
    process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.error('❌ Connection timeout - bot did not connect');
    process.exit(1);
}, 10000);

