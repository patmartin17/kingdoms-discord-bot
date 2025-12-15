# Discord Ticketing System Setup Guide

## Overview
This guide covers setting up a professional ticketing system for your Discord server using Ticket Tool (recommended) or alternative solutions.

---

## 🎫 Why Use Discord for Ticketing?

**Advantages:**
- Centralized support in one place
- Easy for users (they're already on Discord)
- Private channels for sensitive issues
- Easy to track and manage
- Can integrate with your bot for automation
- Free (compared to paid ticketing systems)

**Use Cases:**
- Account linking support
- Bug reports
- Ban appeals
- General questions
- Staff applications
- Technical support

---

## 🤖 Recommended Bot: Ticket Tool

### Why Ticket Tool?
- Most popular ticketing bot (2M+ servers)
- Highly customizable
- Free tier available
- Active development
- Great documentation

### Setup Steps:

#### 1. Invite Ticket Tool
- Go to: https://tickettool.xyz/
- Click "Invite Bot"
- Select your server
- Grant necessary permissions:
  - Manage Channels
  - Manage Messages
  - Send Messages
  - Embed Links
  - Read Message History
  - Manage Roles

#### 2. Basic Configuration

**Create Ticket Categories:**
```
🎫 Support Tickets
  ├── general-support
  ├── account-issues
  ├── bug-reports
  └── ban-appeals
```

**Set Up Ticket Panel:**
- Use `/panel` command in your support channel
- Choose ticket categories
- Customize button text and emoji
- Set which roles can see tickets

#### 3. Ticket Categories Setup

**General Support:**
- For general questions
- Available to all members
- Auto-assign to support staff

**Account Issues:**
- For account linking problems
- Available to all members
- Auto-assign to support staff

**Bug Reports:**
- For reporting bugs
- Available to all members
- Auto-assign to moderators/admins

**Ban Appeals:**
- For appealing bans
- Available to all members
- Auto-assign to admins only

**Staff Applications:**
- For applying to staff
- Available to all members
- Auto-assign to admins

---

## 📋 Ticket Tool Commands

### User Commands:
- `/ticket` - Open ticket creation menu
- Click button on ticket panel - Create ticket

### Staff Commands:
- `/ticket close` - Close current ticket
- `/ticket add <user>` - Add user to ticket
- `/ticket remove <user>` - Remove user from ticket
- `/ticket claim` - Claim ticket (staff)
- `/ticket unclaim` - Unclaim ticket
- `/ticket transcript` - Generate transcript

### Admin Commands:
- `/panel` - Create ticket panel
- `/config` - Configure bot settings
- `/blacklist` - Blacklist user from creating tickets

---

## 🎨 Customization Options

### Ticket Panel Embed:
```yaml
Title: "Need Help? Create a Ticket!"
Description: |
  Select a category below to create a support ticket.
  Our staff will respond as soon as possible!
  
  **Categories:**
  🎫 General Support - General questions
  🔗 Account Issues - Account linking problems
  🐛 Bug Reports - Report bugs
  ⚖️ Ban Appeals - Appeal a ban
  👥 Staff Application - Apply for staff

Color: Blue
Footer: "Response time: Usually within 24 hours"
```

### Ticket Channel Format:
- Channel name: `ticket-{username}` or `ticket-{number}`
- Auto-generated embed with:
  - User who created ticket
  - Category
  - Creation time
  - Staff assigned (if any)

### Auto-Close Settings:
- Close after inactivity: 48-72 hours
- Auto-close message: "This ticket will close in 24 hours due to inactivity"
- Transcript generation: Enabled

---

## 🔄 Alternative Ticketing Solutions

### 1. YAGPDB (Yet Another General Purpose Discord Bot)
**Pros:**
- Multi-purpose bot (ticketing + other features)
- Highly customizable
- Free

**Cons:**
- More complex setup
- Less user-friendly than Ticket Tool

**Setup:**
- Invite YAGPDB
- Use `/ticket` command
- Configure via web dashboard

### 2. Tickets Bot
**Pros:**
- Simple and clean
- Easy to use
- Free

**Cons:**
- Less features than Ticket Tool
- Less customization

### 3. Custom Bot (Your Own)
**Pros:**
- Full control
- Can integrate with your account linking system
- Custom features

**Cons:**
- Requires development time
- Need to maintain it

**When to Use:**
- You want deep integration with your systems
- You need custom features
- You have development resources

---

## 📊 Ticket Management Best Practices

### Staff Training:
1. **Response Time:**
   - Aim for < 1 hour response time
   - Set expectations in ticket panel

2. **Ticket Handling:**
   - Always greet user professionally
   - Ask clarifying questions
   - Provide clear solutions
   - Close tickets when resolved

3. **Escalation:**
   - Know when to escalate to admins
   - Document complex issues
   - Use ticket transcripts

### Ticket Categories Guidelines:

**General Support:**
- Answer within 24 hours
- Can be handled by support staff
- Common questions: FAQ answers

**Account Issues:**
- Answer within 12 hours (urgent)
- May need admin access
- Often related to linking problems

**Bug Reports:**
- Acknowledge within 24 hours
- Forward to development team
- Request screenshots/logs
- Track in bug tracker

**Ban Appeals:**
- Answer within 48 hours
- Admin only
- Review ban reason
- Be fair but firm

**Staff Applications:**
- Review within 1 week
- Admin only
- Use application form
- Interview process

---

## 🔧 Advanced Features

### Integration with Your Bot:

**Auto-Assign Based on Category:**
```javascript
// Example: Auto-assign account issues to account support team
if (ticketCategory === 'account-issues') {
    await ticketChannel.send(`<@&${ACCOUNT_SUPPORT_ROLE_ID}>`);
}
```

**Link Account in Ticket:**
```javascript
// When user creates account-issues ticket
// Bot can check if they're linked
// If not, provide linking instructions
```

**Auto-Close After Resolution:**
```javascript
// When staff marks ticket as resolved
// Wait 24 hours
// Auto-close with transcript
```

### Ticket Analytics:
- Track average response time
- Track resolution time
- Track tickets per category
- Track staff performance

### Ticket Templates:
Create templates for common issues:
- Account linking instructions
- Bug report template
- Ban appeal format

---

## 📝 Ticket Transcripts

### Why Transcripts Matter:
- Record of support interactions
- Useful for training
- Reference for similar issues
- Legal/compliance records

### Transcript Format:
```
Ticket Transcript
================
Ticket ID: #12345
Category: Account Issues
Created: 2024-01-15 10:30 AM
Closed: 2024-01-15 2:45 PM
Duration: 4h 15m

Participants:
- User: @username
- Staff: @staffmember

Messages:
[10:30] User: I can't link my account
[10:35] Staff: Let me help you with that...
...
```

### Storing Transcripts:
- Save to #ticket-logs channel
- Or save to database
- Or export to files

---

## 🎯 Recommended Channel Structure

```
🎫 SUPPORT & TICKETS
├── #ticket-panel (ticket creation)
├── #ticket-logs (archived transcripts)
└── #ticket-staff (staff coordination, private)
```

**Ticket Channels:**
- Created dynamically per ticket
- Auto-deleted after closure (or archived)
- Private to user and staff

---

## ✅ Setup Checklist

### Initial Setup:
- [ ] Invite Ticket Tool bot
- [ ] Create support category
- [ ] Create ticket categories
- [ ] Set up ticket panel
- [ ] Configure staff roles
- [ ] Test ticket creation
- [ ] Test ticket closure
- [ ] Set up auto-close rules

### Staff Setup:
- [ ] Train staff on ticket handling
- [ ] Create response templates
- [ ] Set up escalation process
- [ ] Configure notifications

### Integration:
- [ ] Integrate with your account linking bot
- [ ] Set up auto-assignment rules
- [ ] Configure transcript storage
- [ ] Set up analytics (if desired)

### Testing:
- [ ] Test all ticket categories
- [ ] Test staff commands
- [ ] Test auto-close functionality
- [ ] Test transcript generation
- [ ] Test error scenarios

---

## 🚨 Common Issues & Solutions

### Issue: Bot not creating tickets
**Solution:**
- Check bot permissions
- Verify bot is online
- Check channel permissions

### Issue: Staff can't see tickets
**Solution:**
- Check role permissions
- Verify staff role is configured
- Check category permissions

### Issue: Tickets not auto-closing
**Solution:**
- Check auto-close settings
- Verify bot has permissions
- Check for errors in logs

### Issue: Transcripts not generating
**Solution:**
- Check transcript settings
- Verify bot permissions
- Check #ticket-logs channel exists

---

## 📚 Additional Resources

- Ticket Tool Documentation: https://docs.tickettool.xyz/
- Ticket Tool Support Server: Check their website
- Discord Server Templates: Search for "support server template"

---

**Pro Tip:** Start simple with Ticket Tool, then customize as you learn what your community needs!

