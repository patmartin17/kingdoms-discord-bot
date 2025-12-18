/**
 * Create Permanent Invite Link
 * 
 * Creates a Discord invite link that:
 * - Never expires
 * - No verification/captcha (requires server settings)
 * - Unlimited uses
 * 
 * Usage:
 *   node create-permanent-invite.js
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
        
        // Find a channel to create invite from (use welcome or general)
        const inviteChannel = guild.channels.cache.find(c => 
            (c.name === 'welcome' || c.name === 'general') && 
            c.type === ChannelType.GuildText
        ) || guild.channels.cache.find(c => 
            c.type === ChannelType.GuildText
        );
        
        if (!inviteChannel) {
            console.error('❌ Error: No text channel found to create invite!');
            process.exit(1);
        }
        
        console.log(`📋 Using channel: #${inviteChannel.name}`);
        
        // Check current server settings
        console.log('\n📊 Current Server Settings:');
        console.log(`   Verification Level: ${guild.verificationLevel}`);
        console.log(`   Raid Protection: Check Server Settings → Safety`);
        
        // Create permanent invite
        console.log('\n🔗 Creating permanent invite link...');
        
        const invite = await inviteChannel.createInvite({
            maxAge: 0, // Never expires (0 = permanent)
            maxUses: 0, // Unlimited uses (0 = unlimited)
            temporary: false, // Permanent membership (not temporary)
            unique: true, // Unique invite code
            reason: 'Permanent invite link - no expiration'
        });
        
        console.log(`\n✅ Permanent invite created!`);
        console.log(`\n🔗 Invite Link:`);
        console.log(`   https://discord.gg/${invite.code}`);
        console.log(`\n📝 Invite Details:`);
        console.log(`   • Code: ${invite.code}`);
        console.log(`   • Expires: Never`);
        console.log(`   • Max Uses: Unlimited`);
        console.log(`   • Channel: #${inviteChannel.name}`);
        
        // Important notes
        console.log(`\n⚠️  IMPORTANT: To remove captcha and anti-raid:`);
        console.log(`\n   1. Disable Anti-Raid Filter:`);
        console.log(`      → Server Settings → Safety → Raid Protection`);
        console.log(`      → Turn OFF "Raid Protection"`);
        console.log(`\n   2. Lower Verification Level (to remove captcha):`);
        console.log(`      → Server Settings → Safety → Verification Level`);
        console.log(`      → Set to "None" (no verification)`);
        console.log(`      → OR use the script: npm run disable-verification`);
        console.log(`\n   3. Optional - Disable Auto-Moderation:`);
        console.log(`      → Server Settings → Safety → AutoMod`);
        console.log(`      → Disable any active rules`);
        
        console.log(`\n💡 Note: Verification level affects ALL invites, not just this one.`);
        console.log(`   Setting it to "None" removes captcha but reduces security.`);
        
        // Close bot connection
        setTimeout(() => {
            console.log('\n👋 Closing connection...');
            client.destroy();
            process.exit(0);
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 50013) {
            console.error('   Missing Permissions - Bot needs "Create Instant Invite" permission');
        }
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

