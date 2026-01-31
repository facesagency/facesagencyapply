import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless API endpoint for HubSpot form submissions
 * Standard Node.js runtime for better compatibility
 */

const HUBSPOT_API_URL = 'https://api.hubapi.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[API] ========== HubSpot Submit Handler ==========');
  console.log('[API] Method:', req.method);
  console.log('[API] URL:', req.url);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[API] CORS preflight - returning 204');
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    console.log('[API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get access token from environment
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  console.log('[API] Access token exists:', !!accessToken);
  console.log('[API] HUBSPOT_ACCESS_TOKEN exists:', !!process.env.HUBSPOT_ACCESS_TOKEN);
  console.log('[API] HUBSPOT_PRIVATE_APP_TOKEN exists:', !!process.env.HUBSPOT_PRIVATE_APP_TOKEN);

  if (!accessToken) {
    console.error('[API] ERROR: No access token found in environment');
    return res.status(500).json({
      error: 'HubSpot not configured - missing HUBSPOT_ACCESS_TOKEN'
    });
  }

  try {
    const { properties, action, contactId, searchParams } = req.body;
    console.log('[API] Request body action:', action);
    console.log('[API] Request has properties:', !!properties);
    console.log('[API] Request has contactId:', !!contactId);
    console.log('[API] Request has searchParams:', !!searchParams);

    if (properties) {
      console.log('[API] Properties count:', Object.keys(properties).length);
      console.log('[API] ALL PROPERTIES:', JSON.stringify(properties, null, 2));
      console.log('[API] Property keys:', Object.keys(properties).join(', '));
    }

    let hubspotResponse: Response;

    if (action === 'search') {
      console.log('[API] Performing search...');
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
    } else if (action === 'update' && contactId) {
      console.log('[API] Updating contact:', contactId);
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    } else {
      console.log('[API] Creating new contact...');
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    }

    console.log('[API] HubSpot response status:', hubspotResponse.status);
    const data = await hubspotResponse.json();
    console.log('[API] HubSpot response data:', JSON.stringify(data, null, 2));

    if (!hubspotResponse.ok) {
      console.error('[API] HubSpot API error:', data);
      return res.status(hubspotResponse.status).json({
        success: false,
        error: data.message || 'HubSpot API error',
        details: data
      });
    }

    console.log('[API] SUCCESS - Contact ID:', data.id);
    return res.status(200).json({
      success: true,
      contactId: data.id,
      data
    });
  } catch (error) {
    console.error('[API] ========== EXCEPTION ==========');
    console.error('[API] Error:', error);
    console.error('[API] Error type:', typeof error);
    console.error('[API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return res.status(500).json({
      success: false,
      error: String(error)
    });
  }
}
