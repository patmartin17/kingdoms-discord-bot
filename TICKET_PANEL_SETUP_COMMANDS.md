# Ticket Panel Setup - Exact Commands

## 🎯 Quick Setup (Copy & Paste)

### Step 1: Create Ticket Panel

Go to **#ticket-panel** channel and run:

```
/panel create
```

Then follow the interactive setup:

1. **Panel Name**: "Need Help? Create a Ticket!"
2. **Panel Description**: 
   ```
   Select a category below to create a support ticket.
   Our staff will respond as soon as possible!
   
   **Categories:**
   🎫 General Support - General questions
   🔗 Account Issues - Account linking problems
   🐛 Bug Reports - Report bugs/issues
   ⚖️ Ban Appeals - Appeal a ban
   👥 Staff Application - Apply for staff
   ```

3. **Button 1**:
   - Label: "General Support"
   - Emoji: 🎫
   - Category: General Support

4. **Button 2**:
   - Label: "Account Issues"
   - Emoji: 🔗
   - Category: Account Issues

5. **Button 3**:
   - Label: "Bug Reports"
   - Emoji: 🐛
   - Category: Bug Reports

6. **Button 4**:
   - Label: "Ban Appeals"
   - Emoji: ⚖️
   - Category: Ban Appeals

7. **Button 5**:
   - Label: "Staff Application"
   - Emoji: 👥
   - Category: Staff Application

8. **Staff Roles**: Select "Mod" and "Admin" roles

---

## ⚙️ Configure Auto-Close

Run in any channel:

```
/config
```

Then set:
- **Auto-close**: Enabled
- **General Support**: 48 hours inactivity
- **Account Issues**: 24 hours inactivity
- **Bug Reports**: 72 hours inactivity
- **Ban Appeals**: 7 days inactivity
- **Staff Applications**: 14 days inactivity

---

## 📋 Configure Transcripts

Run:

```
/config transcript
```

Set:
- **Channel**: #ticket-logs
- **Format**: Markdown
- **Include**: All messages, user info, timestamps

---

## ✅ Test It!

1. Click a button on the ticket panel
2. A private channel should be created
3. Test closing: `/ticket close`
4. Check #ticket-logs for transcript

---

**That's it! Your ticket system is ready!**

