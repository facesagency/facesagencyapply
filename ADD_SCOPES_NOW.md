# 🚨 ADD SCOPES TO HUBSPOT APP - STEP BY STEP

## You MUST do this in HubSpot right now:

### Step 1: Open HubSpot Settings
1. Go to: **https://app.hubspot.com**
2. Click the **⚙️ gear icon** in the top right corner
3. This opens Settings

### Step 2: Navigate to Private Apps
1. In the **left sidebar**, scroll down to find **"Integrations"**
2. Click **"Integrations"**
3. Click **"Private Apps"**

### Step 3: Find Your App
1. You should see your app in the list (the one you just created)
2. **Click on the app name** to open it

### Step 4: Go to Scopes Tab
1. You'll see tabs at the top: **"Basic Info"**, **"Scopes"**, etc.
2. Click the **"Scopes"** tab

### Step 5: Add Contact Scopes
1. You'll see a long list of permissions with checkboxes
2. Use the search box at the top to search for: **"contacts"**
3. Find these two items and **CHECK THE BOXES**:
   - ☑️ **Read contacts** (`crm.objects.contacts.read`)
   - ☑️ **Write contacts** (`crm.objects.contacts.write`)

### Step 6: Save
1. Click the **"Update"** or **"Save"** button at the bottom
2. You might see a popup asking to confirm - click **"Yes"** or **"Confirm"**

### Step 7: Get Token (May Have Changed)
1. Go back to the **"Basic Info"** tab
2. Find the **"Access token"** section
3. Click **"Show token"**
4. **Copy the entire token**
5. **Paste it back here in the terminal**

---

## Visual Guide

**What you're looking for:**

In the Scopes tab, you'll see something like:

```
🔍 Search scopes...

CRM
  Contacts
    ☑️ Read contacts (crm.objects.contacts.read)     ← CHECK THIS
    ☑️ Write contacts (crm.objects.contacts.write)   ← CHECK THIS

  Companies
    ☐ Read companies
    ☐ Write companies

  Deals
    ☐ Read deals
    ☐ Write deals
```

**You ONLY need to check the 2 "Contacts" boxes.**

---

## After You Do This

Once you've:
1. ✅ Checked the 2 boxes
2. ✅ Clicked Save/Update
3. ✅ Copied the token

Paste the token here and I'll test it immediately!

---

## Still Getting 403?

If you're sure you checked the boxes but still getting 403:
- Make sure you clicked **"Update"** or **"Save"** at the bottom
- The token may have regenerated - copy the NEW token from Basic Info tab
- Make sure you're in the correct HubSpot account (Faces Agency)
