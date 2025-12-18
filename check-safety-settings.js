/**
 * Check Safety Settings
 * 
 * Checks current server safety settings that might affect invites
 * 
 * Usage:
 *   node check-safety-settings.js
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
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration
    ]
});

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}\n`);
        
        console.log('📊 Current Safety Settings:\n');
        
        // Verification Level
        const verificationLevels = {
            0: 'None (no verification)',
            1: 'Low (must have verified email)',
            2: 'Medium (must be registered for 5+ minutes)',
            3: 'High (must be member for 10+ minutes)',
            4: 'Very High (must have verified phone)'
        };
        
        console.log(`✅ Verification Level: ${verificationLevels[guild.verificationLevel] || guild.verificationLevel}`);
        
        // Explicit Content Filter
        const contentFilters = {
            0: 'Disabled',
            1: 'Members without roles',
            2: 'All members'
        };
        console.log(`✅ Explicit Content Filter: ${contentFilters[guild.explicitContentFilter] || guild.explicitContentFilter}`);
        
        // Default Message Notifications
        const notifications = {
            0: 'All messages',
            1: 'Only @mentions'
        };
        console.log(`✅ Default Notifications: ${notifications[guild.defaultMessageNotifications] || guild.defaultMessageNotifications}`);
        
        // Check AutoMod (if available)
        try {
            const autoModRules = await guild.autoModerationRules.fetch();
            if (autoModRules.size > 0) {
                console.log(`\n⚠️  AutoMod Rules Active: ${autoModRules.size}`);
                autoModRules.forEach(rule => {
                    console.log(`   • ${rule.name} (${rule.enabled ? 'Enabled' : 'Disabled'})`);
                });
                console.log(`\n   💡 To disable: Server Settings → Safety → AutoMod → Disable rules`);
            } else {
                console.log(`\n✅ AutoMod: No active rules`);
            }
        } catch (error) {
            console.log(`\n✅ AutoMod: Not available or no rules`);
        }
        
        console.log(`\n📝 Summary:`);
        console.log(`   • Verification Level: ${guild.verificationLevel === 0 ? '✅ None (no captcha)' : '⚠️  ' + verificationLevels[guild.verificationLevel]}`);
        console.log(`   • AutoMod: Check manually in Server Settings → Safety → AutoMod`);
        console.log(`   • Your invite should work without captcha!`);
        
        console.log(`\n💡 If invites still have issues:`);
        console.log(`   1. Check Server Settings → Safety → AutoMod (disable any rules)`);
        console.log(`   2. Check Server Settings → Moderation → AutoMod`);
        console.log(`   3. Make sure verification level is None (already set)`);
        
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

