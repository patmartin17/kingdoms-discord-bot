#!/bin/bash

# Deploy Discord Bot to Render
# This script helps deploy your bot to Render

echo "🚀 Deploying Discord Bot to Render..."
echo ""

# Check if render-cli is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    npm install -g render-cli
fi

# Login to Render
echo "🔐 Logging into Render..."
render login

# Check if we're in the right directory
if [ ! -f "activate-ticket-buttons.js" ]; then
    echo "❌ Error: activate-ticket-buttons.js not found"
    echo "   Make sure you're in the discord server directory"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   You'll need to set environment variables in Render dashboard"
fi

echo ""
echo "✅ Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Go to: https://dashboard.render.com"
echo "2. Click 'New +' → 'Background Worker'"
echo "3. Connect your GitHub repo"
echo "4. Set start command: node activate-ticket-buttons.js"
echo "5. Add environment variables: DISCORD_TOKEN and GUILD_ID"
echo ""
echo "Or use: render deploy (if you have render.yaml configured)"

