# HubSpot Integration Setup

This guide will help you set up the HubSpot integration for the Faces Agency application form.

## Overview

The application form now sends data directly to HubSpot via a Vercel serverless function, bypassing Supabase for the HubSpot sync.

## Setup Steps

### 1. Get Your HubSpot Access Token

1. Log in to your HubSpot account
2. Navigate to **Settings** → **Integrations** → **Private Apps**
3. Click **Create a private app**
4. Give it a name like "Faces Agency Form Integration"
5. Under the **Scopes** tab, select the following permissions:
   - `crm.objects.contacts.write` - To create/update contacts
   - `crm.objects.contacts.read` - To search for existing contacts
6. Click **Create app**
7. Copy the **Access Token** that appears

### 2. Configure Environment Variables

#### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your HubSpot access token:
   ```
   HUBSPOT_ACCESS_TOKEN=pat-na1-xxxx-xxxx-xxxx
   ```

#### Vercel Deployment

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `HUBSPOT_ACCESS_TOKEN`
   - **Value**: Your HubSpot access token
   - **Environments**: Select Production, Preview, and Development
5. Click **Save**

### 3. Deploy to Vercel

1. Push your code to your git repository
2. Vercel will automatically deploy your changes
3. The API route will be available at `https://your-domain.com/api/hubspot`

### 4. HubSpot Custom Properties

The integration sends the following data to HubSpot. You may need to create custom properties in HubSpot for fields that don't exist by default:

**Default Properties:**
- `email`
- `firstname`
- `lastname`
- `phone`
- `mobilephone`

**Custom Properties (create these in HubSpot if needed):**
- `middlename`
- `date_of_birth`
- `nationality`
- `whatsapp`
- `instagram`
- `governorate`
- `district`
- `area`
- `height`
- `weight`
- `eye_color`
- `hair_color`
- `hair_type`
- `skin_tone`
- `languages` (JSON array)
- `talents` (JSON array)
- `sports` (JSON array)
- `experience`
- `has_car`
- `has_passport`
- `willing_to_travel`

To create custom properties:
1. In HubSpot, go to **Settings** → **Properties**
2. Click **Create property**
3. Select **Contact properties**
4. Add each custom property with the appropriate field type

### 5. Testing

1. Run your application locally:
   ```bash
   npm run dev
   ```

2. Fill out and submit the application form

3. Check your browser console for logs:
   - "Starting application submission for: [email]"
   - "HubSpot submission successful: [data]"

4. Verify the contact appears in HubSpot:
   - Go to **Contacts** → **Contacts** in HubSpot
   - Search for the email you just submitted
   - Check that all fields are populated correctly

## Troubleshooting

### "HubSpot API is not properly configured"
- Make sure `HUBSPOT_ACCESS_TOKEN` is set in your environment variables
- Restart your development server after adding environment variables

### "Failed to submit application to HubSpot"
- Check the browser console for detailed error messages
- Verify your HubSpot access token is valid
- Ensure you have the correct scopes enabled for your private app

### Contact Already Exists (409 Error)
- The API automatically handles this by searching for the existing contact and updating it
- If you still see errors, check that the `crm.objects.contacts.read` scope is enabled

### Custom Properties Not Saving
- Make sure you've created the custom properties in HubSpot
- Verify the property names match exactly (case-sensitive)
- Check that the field types are compatible (text, number, etc.)

## How It Works

1. User submits the application form
2. `submitApplication()` function in [src/lib/submitApplication.ts](src/lib/submitApplication.ts:69) sends a POST request to `/api/hubspot`
3. Vercel serverless function at [api/hubspot.ts](api/hubspot.ts) receives the request
4. The function creates or updates a contact in HubSpot via the HubSpot API
5. Success/error response is returned to the user

## Notes

- Supabase is still used for the admin dashboard (authentication and data storage)
- The form submission no longer stores data in Supabase
- All applicant data goes directly to HubSpot
