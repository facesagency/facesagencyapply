# HubSpot Integration Testing Guide

## Quick Test (2 minutes)

### Step 1: Access the Debug Page
1. Go to your deployed site: `https://facesagencyapply.vercel.app/debug-hubspot`
2. You'll see the HubSpot Debug Panel with environment info and test buttons

**NOTE:** If you get a 404, the API functions are not deployed. See [DEPLOYMENT_ISSUE.md](DEPLOYMENT_ISSUE.md).

### Step 2: Run the Serverless API Test
1. Click the **"Test Serverless API (Production)"** button
2. This will directly test the `/api/hubspot-submit` endpoint
3. Watch the console output in the black terminal box

### Step 3: Check Results
The test will show:
- ✅ **SUCCESS! Contact ID: [number]** - The submission worked!
- ❌ **FAILED: [error message]** - Shows what went wrong

### Step 4: Verify in HubSpot
1. Log into your HubSpot account: https://app.hubspot.com
2. Go to **Contacts** → **Contacts**
3. Search for "ServerlessTest Debug" (the test contact name)
4. You should see the test contact that was just created

## What Each Test Button Does

### 1. Test Serverless API (Production)
- **What it does:** Directly calls `/api/hubspot-submit` with test data
- **When to use:** To verify the production API is working
- **What it tests:** Environment variables, API function, HubSpot connection

### 2. Test syncToHubSpot (Full Flow)
- **What it does:** Simulates the complete form submission flow
- **When to use:** To test the entire integration as users experience it
- **What it tests:** Frontend → API → HubSpot (complete chain)

### 3. Test Vite Proxy (Dev Only)
- **What it does:** Tests the development proxy (only works locally with `npm run dev`)
- **When to use:** For local development testing only
- **What it tests:** Local proxy configuration

## Troubleshooting

### If you see: "HubSpot not configured - missing HUBSPOT_ACCESS_TOKEN"

**Solution:**
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key:** `HUBSPOT_ACCESS_TOKEN`
   - **Value:** `pat-eu1-741e9cfb-a2a4-4efd-9fac-b2971fad7a6a`
   - **Environments:** Check all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** and **Redeploy** the latest deployment
7. Wait 1-2 minutes for redeployment
8. Try the test again

### If you see: "401 Unauthorized" or "Invalid token"

**Solution:**
1. Go to HubSpot: https://app.hubspot.com
2. Go to **Settings** (gear icon) → **Integrations** → **Private Apps**
3. Find your app or create a new one
4. Required scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`
5. Copy the new access token
6. Update the `HUBSPOT_ACCESS_TOKEN` in Vercel (see above)
7. Redeploy

### If you see: "Property doesn't exist" errors

**Solution:**
1. Go to HubSpot → **Settings** → **Data Management** → **Properties**
2. Filter by "Faces" or search for `faces_`
3. Make sure all custom properties exist with `faces_` prefix
4. Create missing properties as **Single-line text** or appropriate type

## Checking Vercel Logs

For detailed debugging:
1. Go to Vercel Dashboard → your project
2. Click **Functions** tab
3. Click on `api/hubspot-submit`
4. View real-time logs showing:
   - `[API]` prefixed messages showing request details
   - Environment variable status
   - HubSpot API responses

## Form Submission Test (Full End-to-End)

To test the actual registration form:
1. Go to your site homepage
2. Fill out the complete registration form
3. Submit
4. Check HubSpot contacts for the new entry
5. The contact should have all the form data as custom properties

## Success Criteria

You'll know it's working when:
1. ✅ Debug test shows "SUCCESS! Contact ID: [number]"
2. ✅ Contact appears in HubSpot within seconds
3. ✅ Contact has all the test data (firstname: ServerlessTest, lastname: Debug, etc.)
4. ✅ Form submissions from the website also appear in HubSpot
5. ✅ All custom `faces_*` properties are populated

## Still Having Issues?

Check the browser console (F12 → Console tab) for detailed logs:
- `[HubSpot]` messages show the sync process
- `[API]` messages show the serverless function activity
- `[submitApplication]` messages show the form submission flow

All steps are heavily logged for easy debugging.
