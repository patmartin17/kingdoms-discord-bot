# 🎫 Setting Up Ticket Tool Properly

## Quick Setup Guide

### Step 1: Make Yourself Admin of Ticket Tool
In Discord, run:
```
/addadmin @YourUsername
```
Or if you're the server owner, Ticket Tool should already recognize you.

### Step 2: Configure Basic Settings
Go to the web dashboard: **https://dashboard.tickets.bot**

1. Login with Discord
2. Select your server from the list
3. Go to **Settings** tab

**Configure these essential settings:**

- **Transcripts Channel**: Select a channel (e.g., `#ticket-logs`) where closed ticket summaries will be sent
- **Channel Category**: Select a category where ticket channels will be created (e.g., "TICKETS" category)
- **Per User Simultaneous Ticket Limit**: Set to `1` (recommended)
- **Welcome Message**: Customize the message users see when they open a ticket
- Click **Submit** to save

### Step 3: Add Support Staff
In Discord, run:
```
/addsupport @Mod
/addsupport @Admin
```
Or add individual users:
```
/addsupport @Username
```

### Step 4: Create a Ticket Panel

**Option A: Single Panel (One Button)**
1. Go to dashboard → **Ticket Panels** tab
2. Click **New Panel** card
3. Configure:
   - **Panel Title**: "Open a ticket!"
   - **Panel Content**: Describe your support system
   - **Panel Channel**: Select channel where panel will appear (e.g., `#support`)
   - **Button Text**: "Open Ticket" or "Get Help"
   - **Button Emoji**: 📩 or any emoji
   - **Ticket Category**: Select category for tickets
4. Click **Create**

**Option B: Multi-Panel (Multiple Buttons - RECOMMENDED)**
1. First, create individual panels:
   - Panel 1: "General Support" → Category: "SUPPORT TICKETS"
   - Panel 2: "Ban Appeal" → Category: "APPEAL TICKETS"
   
2. Then create Multi-Panel:
   - Go to **Ticket Panels** tab
   - Look at **right side** → **New Multi-Panel** card
   - **Panel Title**: "Need Help? Open a Ticket!"
   - **Panel Content**: "Choose the type of ticket you need"
   - **Panel Channel**: Select channel (e.g., `#support`)
   - **Panels**: Select Panel 1 and Panel 2 from dropdown
   - **Use Dropdown Menu**: Leave unchecked (for buttons) or checked (for dropdown)
   - Click **Submit**

### Step 5: Test It!
1. Go to the channel where you created the panel
2. You should see Ticket Tool's panel message with button(s)
3. Click the button to open a test ticket
4. Verify the ticket channel was created correctly

---

## Common Issues & Fixes

**Panel doesn't appear:**
- Make sure you clicked "Create" or "Submit" in the dashboard
- Check that the channel you selected exists
- Refresh Discord

**Staff can't see tickets:**
- Run `/addsupport @RoleName` for your staff roles
- Or add them via dashboard → **Staff Teams** → **Default Team**

**Tickets not creating:**
- Check Ticket Tool has "Manage Channels" permission
- Verify the category exists and Ticket Tool has access
- Check server boost level (some features require boosts)

**Want multiple ticket types:**
- Use **Multi-Panel** (Option B above)
- Each button can open different ticket types
- Each can have different support teams, categories, etc.

---

## Advanced: Customize Welcome Message

In dashboard → **Settings** → **Welcome Message**, you can use placeholders:

```
Hello %user%! 

Your ticket ID is: %ticket_id%
You have %user_open_tickets% open ticket(s).

How can we help you today?
```

**Available placeholders:**
- `%user%` - Mentions the user
- `%username%` - User's name
- `%ticket_id%` - Ticket number
- `%channel%` - Mentions the ticket channel
- `%time%` - Current time
- `%date%` - Today's date

---

## Next Steps

Once Ticket Tool is set up:
- ✅ Users click button → Ticket opens automatically
- ✅ Staff get notified
- ✅ Ticket closes → Transcript saved automatically
- ✅ All managed by Ticket Tool

Your MakerBot can still handle other things, but Ticket Tool will handle all ticketing!


