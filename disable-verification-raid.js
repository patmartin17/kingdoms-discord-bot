/**
 * Disable Verification and Raid Protection
 * 
 * Lowers verification level to None (removes captcha)
 * Note: Raid protection must be disabled manually in Discord
 * 
 * Usage:
 *   node disable-verification-raid.js
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

client.once('clientReady', async () => {
    console.log('✅ Bot is online!');
    console.log(`   Logged in as: ${client.user.tag}`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`   Server: ${guild.name}\n`);
        
        console.log(`📊 Current Settings:`);
        console.log(`   Verification Level: ${guild.verificationLevel}`);
        
        // Set verification level to None (no captcha)
        console.log('\n🔧 Setting verification level to None (no captcha)...');
        
        try {
            // 0 = None (no verification), 1 = Low, 2 = Medium, 3 = High, 4 = Very High
            await guild.setVerificationLevel(0, 'Disable captcha for invites');
            console.log(`   ✅ Verification level set to None (0)`);
            console.log(`   → No captcha required for new members`);
        } catch (error) {
            console.error(`   ⚠️  Could not set verification level: ${error.message}`);
            console.log(`   → You may need to do this manually in Server Settings → Safety`);
            console.log(`   → Set Verification Level to "None"`);
        }
        
        console.log(`\n⚠️  IMPORTANT: Raid Protection must be disabled MANUALLY:`);
        console.log(`\n   1. Go to Server Settings → Safety`);
        console.log(`   2. Find "Raid Protection" section`);
        console.log(`   3. Turn OFF "Raid Protection"`);
        console.log(`   4. Save changes`);
        console.log(`\n   This cannot be done via API - must be done in Discord client.`);
        
        console.log(`\n✅ Settings updated!`);
        console.log(`\n📝 Summary:`);
        console.log(`   • Verification Level: None (no captcha)`);
        console.log(`   • Raid Protection: Disable manually in Server Settings`);
        console.log(`   • Invites will now work without captcha`);
        
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

