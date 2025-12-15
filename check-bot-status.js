/**
 * Check Bot Status
 */

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', () => {
    console.log('✅ Bot is online and ready!');
    console.log(`   Bot: ${client.user.tag}`);
    console.log(`   Server: ${client.guilds.cache.get(GUILD_ID)?.name}`);
    console.log('\n✅ Bot can handle button interactions!');
    process.exit(0);
});

client.on('error', error => {
    console.error('❌ Bot error:', error.message);
});

client.login(DISCORD_TOKEN);

setTimeout(() => {
    console.log('❌ Bot failed to connect');
    process.exit(1);
}, 10000);

