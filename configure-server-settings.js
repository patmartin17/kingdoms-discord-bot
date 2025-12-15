/**
 * Configure Kingdoms Server Settings
 * 
 * Sets up important server settings automatically
 */

const { Client, GatewayIntentBits, VerificationLevel, AutoModerationRuleTriggerType, AutoModerationRuleActionType } = require('discord.js');
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

async function configureServerSettings() {
    try {
        console.log('🔌 Connecting to Discord...\n');
        await client.login(DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully\n');

        const guild = await client.guilds.fetch(GUILD_ID);
        console.log(`⚙️  Configuring settings for server: ${guild.name}\n`);

        const changes = [];

        // 1. Set Verification Level (Medium - requires verified email)
        try {
            if (guild.verificationLevel !== VerificationLevel.Medium) {
                await guild.setVerificationLevel(VerificationLevel.Medium, 'Auto-setup: Security');
                changes.push('✅ Set verification level to Medium (requires verified email)');
            } else {
                changes.push('ℹ️  Verification level already set to Medium');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set verification level: ${error.message}`);
        }

        // 2. Set Default Message Notifications (Only @mentions)
        try {
            if (guild.defaultMessageNotifications !== 1) {
                await guild.setDefaultMessageNotifications(1, 'Auto-setup: Reduce noise'); // 1 = Only @mentions
                changes.push('✅ Set default notifications to "Only @mentions"');
            } else {
                changes.push('ℹ️  Default notifications already set correctly');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set notification settings: ${error.message}`);
        }

        // 3. Set Explicit Content Filter (Medium)
        try {
            if (guild.explicitContentFilter !== 1) {
                await guild.setExplicitContentFilter(1, 'Auto-setup: Safety'); // 1 = Medium
                changes.push('✅ Set explicit content filter to Medium');
            } else {
                changes.push('ℹ️  Explicit content filter already set');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set content filter: ${error.message}`);
        }

        // 4. Enable 2FA Requirement for Moderation (if bot has permission)
        try {
            // This requires ManageGuild permission
            if (guild.mfaLevel !== 1) {
                await guild.setMFALevel(1, 'Auto-setup: Security'); // 1 = Elevated (requires 2FA for mod actions)
                changes.push('✅ Enabled 2FA requirement for moderation actions');
            } else {
                changes.push('ℹ️  2FA requirement already enabled');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set 2FA requirement: ${error.message} (may need higher permissions)`);
        }

        // 5. Set System Channel (for system messages)
        try {
            const systemChannel = guild.channels.cache.find(c => 
                c.name === 'server-status' || 
                c.name === 'announcements' ||
                c.name === 'general'
            );
            
            if (systemChannel && guild.systemChannelId !== systemChannel.id) {
                await guild.setSystemChannel(systemChannel.id, 'Auto-setup: System messages');
                changes.push(`✅ Set system channel to #${systemChannel.name}`);
            } else if (guild.systemChannelId) {
                changes.push('ℹ️  System channel already configured');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set system channel: ${error.message}`);
        }

        // 6. Set Rules Channel
        try {
            const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
            if (rulesChannel && guild.rulesChannelId !== rulesChannel.id) {
                await guild.setRulesChannel(rulesChannel.id, 'Auto-setup: Rules');
                changes.push(`✅ Set rules channel to #${rulesChannel.name}`);
            } else if (guild.rulesChannelId) {
                changes.push('ℹ️  Rules channel already configured');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set rules channel: ${error.message}`);
        }

        // 7. Set Public Updates Channel (for Discord updates)
        try {
            const updatesChannel = guild.channels.cache.find(c => c.name === 'updates' || c.name === 'announcements');
            if (updatesChannel && guild.publicUpdatesChannelId !== updatesChannel.id) {
                await guild.setPublicUpdatesChannel(updatesChannel.id, 'Auto-setup: Public updates');
                changes.push(`✅ Set public updates channel to #${updatesChannel.name}`);
            } else if (guild.publicUpdatesChannelId) {
                changes.push('ℹ️  Public updates channel already configured');
            }
        } catch (error) {
            changes.push(`⚠️  Could not set public updates channel: ${error.message}`);
        }

        // Print summary
        console.log('📊 Configuration Summary:\n');
        changes.forEach(change => console.log(`   ${change}`));

        console.log('\n✅ Server settings configured!\n');
        console.log('📝 Manual Settings to Configure:');
        console.log('   1. Server Icon: Server Settings → Overview → Server Icon');
        console.log('   2. Server Banner: Server Settings → Overview → Server Banner');
        console.log('   3. Server Description: Server Settings → Overview → Server Description');
        console.log('   4. Welcome Screen: Server Settings → Onboarding → Enable');
        console.log('   5. Auto-Moderation: Server Settings → Safety → AutoMod');
        console.log('   6. Widget: Server Settings → Widget → Enable');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.destroy();
    }
}

console.log('🔌 Connecting to Discord...\n');
client.login(DISCORD_TOKEN);

client.once('ready', () => {
    configureServerSettings();
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    client.destroy();
    process.exit(1);
});

