# Kingdoms Server - Ticketing System Outline

## 🎯 System Overview

### Purpose:
- Handle support requests
- Account linking issues
- Bug reports
- Ban appeals
- Staff applications

---

## 📋 Ticket Categories

### 1. **🎫 General Support**
- **Purpose**: General questions and help
- **Who can use**: Everyone
- **Staff**: Mod + Admin
- **Auto-close**: 48 hours inactivity

### 2. **🔗 Account Issues**
- **Purpose**: Account linking problems
- **Who can use**: Everyone
- **Staff**: Mod + Admin
- **Auto-close**: 24 hours inactivity
- **Priority**: High (account-related)

### 3. **🐛 Bug Reports**
- **Purpose**: Report bugs/issues
- **Who can use**: Everyone
- **Staff**: Mod + Admin
- **Auto-close**: 72 hours inactivity
- **Template**: Request screenshots/logs

### 4. **⚖️ Ban Appeals**
- **Purpose**: Appeal server bans
- **Who can use**: Everyone
- **Staff**: Admin only
- **Auto-close**: 7 days inactivity
- **Template**: Ban appeal form

### 5. **👥 Staff Application**
- **Purpose**: Apply for staff positions
- **Who can use**: Everyone
- **Staff**: Admin only
- **Auto-close**: 14 days inactivity
- **Template**: Application form

---

## 🏗️ Channel Structure

### Ticket Channels:
- **#ticket-panel** - Ticket creation panel (already exists)
- **#ticket-logs** - Archive of closed tickets (already exists)
- **#ticket-staff** - Staff coordination (already exists)

### Auto-Created Channels:
- Ticket Tool will create channels like:
  - `ticket-username` or `ticket-12345`
  - Private to user and staff
  - Auto-deleted after closure (or archived)

---

## ⚙️ Configuration

### Ticket Panel Setup:
- **Location**: #ticket-panel channel
- **Type**: Button panel with categories
- **Button Style**: Custom emojis and text
- **Staff Roles**: Mod, Admin

### Auto-Close Settings:
- **General Support**: 48 hours
- **Account Issues**: 24 hours
- **Bug Reports**: 72 hours
- **Ban Appeals**: 7 days
- **Staff Applications**: 14 days

### Transcripts:
- **Save to**: #ticket-logs channel
- **Format**: Markdown with timestamps
- **Include**: All messages, user info, staff actions

---

## 👥 Staff Workflow

### When Ticket Created:
1. User clicks button on panel
2. Private channel created
3. Staff notified (ping Mod/Admin roles)
4. Staff claims ticket

### During Ticket:
1. Staff responds to user
2. Can add other staff if needed
3. Can remove user if resolved
4. Update ticket status

### Closing Ticket:
1. Staff runs `/ticket close`
2. Transcript generated
3. Sent to #ticket-logs
4. Channel deleted (or archived)

---

## 🎨 Customization

### Panel Embed:
- Title: "Need Help? Create a Ticket!"
- Description: Clear instructions
- Color: Your brand color
- Footer: Response time info

### Button Labels:
- 🎫 General Support
- 🔗 Account Issues
- 🐛 Bug Reports
- ⚖️ Ban Appeals
- 👥 Staff Application

---

## 📊 Analytics (Optional)

Track:
- Tickets per category
- Average response time
- Resolution time
- Staff performance
- Common issues

---

## ✅ Next Steps:

1. Create ticket panel in #ticket-panel
2. Configure categories
3. Set up staff roles
4. Configure auto-close
5. Test ticket creation
6. Set up transcripts

---

**Ready to implement!**

