/**
 * Discord Server Cleanup Script
 * 
 * Deletes all channels and categories from the server
 * Use with caution - this will delete everything!
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
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

async function cleanupChannels() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`🗑️  Cleaning up server: ${guild.name}\n`);

        // Fetch all channels
        const channels = await guild.channels.fetch();
        const channelsArray = Array.from(channels.values());

        console.log(`📊 Found ${channelsArray.length} channels/categories to delete\n`);

        // Delete all channels (categories will be deleted too)
        let deletedCount = 0;
        let failedCount = 0;

        for (const channel of channelsArray) {
            try {
                // Skip system channels (like #general if it's the default)
                if (channel.id === guild.rulesChannelId || channel.id === guild.publicUpdatesChannelId) {
                    console.log(`⏭️  Skipping system channel: ${channel.name}`);
                    continue;
                }

                console.log(`🗑️  Deleting: ${channel.name} (${channel.type === ChannelType.GuildCategory ? 'Category' : channel.type === ChannelType.GuildVoice ? 'Voice' : 'Text'})`);
                await channel.delete();
                deletedCount++;
            } catch (error) {
                console.error(`❌ Failed to delete ${channel.name}:`, error.message);
                failedCount++;
            }
        }

        console.log('\n✅ Cleanup complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   - Deleted: ${deletedCount} channels/categories`);
        console.log(`   - Failed: ${failedCount}`);
        console.log(`   - Skipped: System channels`);
        console.log('\n🎉 Your server is now clean and ready for recording!');

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        client.destroy();
    }
}

// Run the cleanup
console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    cleanupChannels();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

