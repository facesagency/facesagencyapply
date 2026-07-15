import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless API endpoint for HubSpot form submissions — hardened.
 *
 * - CORS restricted to the Faces application origins
 * - Actions restricted to: search / create / update
 * - Property names allow-listed (blocks arbitrary CRM writes)
 * - Search restricted to the duplicate-detection shape used by the form
 */

const HUBSPOT_API_URL = 'https://api.hubapi.com';

const ALLOWED_ORIGINS = [
  'https://facesagencyapply.com',
  'https://www.facesagencyapply.com',
];

// Property names the public form is allowed to write.
// Anything outside this list is stripped before reaching HubSpot.
const ALLOWED_PROPERTY_PREFIX = 'faces_';
const ALLOWED_EXACT_PROPERTIES = new Set([
  'email',
  'firstname',
  'lastname',
  'phone',
  'age_category',
  'talent_id',
  'willing_to_shave_beard',
  'dance_styles',
  'musical_instruments',
  'instrument_levels',
  'needs_id',
]);

// Properties the duplicate search may filter and return
const ALLOWED_SEARCH_PROPERTIES = new Set([
  'faces_mobile',
  'faces_whatsapp',
  'phone',
  'firstname',
  'faces_date_of_birth',
]);

function isAllowedProperty(name: string): boolean {
  return name.startsWith(ALLOWED_PROPERTY_PREFIX) || ALLOWED_EXACT_PROPERTIES.has(name);
}

function filterProperties(properties: Record<string, unknown>): Record<string, string> {
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(properties || {})) {
    if (isAllowedProperty(key) && (typeof value === 'string' || typeof value === 'number')) {
      filtered[key] = String(value);
    }
  }
  return filtered;
}

function isValidSearchParams(searchParams: unknown): boolean {
  if (!searchParams || typeof searchParams !== 'object') return false;
  const sp = searchParams as { filterGroups?: unknown; properties?: unknown };
  if (!Array.isArray(sp.filterGroups) || sp.filterGroups.length === 0 || sp.filterGroups.length > 5) return false;
  for (const group of sp.filterGroups) {
    const filters = (group as { filters?: unknown }).filters;
    if (!Array.isArray(filters) || filters.length === 0 || filters.length > 3) return false;
    for (const f of filters) {
      const filter = f as { propertyName?: unknown; operator?: unknown };
      if (typeof filter.propertyName !== 'string' || !ALLOWED_SEARCH_PROPERTIES.has(filter.propertyName)) return false;
      if (filter.operator !== 'EQ') return false;
    }
  }
  if (sp.properties !== undefined) {
    if (!Array.isArray(sp.properties)) return false;
    for (const p of sp.properties) {
      if (typeof p !== 'string' || !ALLOWED_SEARCH_PROPERTIES.has(p)) return false;
    }
  }
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS: only the Faces form origins (same-origin requests send no Origin header — allowed)
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Block cross-site requests from unknown origins
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!accessToken) {
    console.error('[API] ERROR: No access token found in environment');
    return res.status(500).json({ error: 'HubSpot not configured - missing HUBSPOT_ACCESS_TOKEN' });
  }

  try {
    const { properties, action, contactId, searchParams } = req.body || {};

    let hubspotResponse: Response;

    if (action === 'search') {
      if (!isValidSearchParams(searchParams)) {
        return res.status(400).json({ success: false, error: 'Invalid search parameters' });
      }
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
    } else if (action === 'update') {
      if (typeof contactId !== 'string' || !/^\d+$/.test(contactId)) {
        return res.status(400).json({ success: false, error: 'Invalid contact ID' });
      }
      const safeProperties = filterProperties(properties);
      if (Object.keys(safeProperties).length === 0) {
        return res.status(400).json({ success: false, error: 'No valid properties' });
      }
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: safeProperties }),
      });
    } else if (action === 'create') {
      const safeProperties = filterProperties(properties);
      if (Object.keys(safeProperties).length === 0) {
        return res.status(400).json({ success: false, error: 'No valid properties' });
      }
      hubspotResponse = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: safeProperties }),
      });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    const data = await hubspotResponse.json();

    if (!hubspotResponse.ok) {
      console.error('[API] HubSpot API error:', data);
      return res.status(hubspotResponse.status).json({
        success: false,
        error: data.message || 'HubSpot API error',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      contactId: data.id,
      data
    });
  } catch (error) {
    console.error('[API] EXCEPTION:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
}
