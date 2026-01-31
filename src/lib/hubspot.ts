// src/lib/hubspot.ts

export type ApplicationContact = {
  firstName?: string;
  middleName?: string;
  lastName?: string;

  email?: string;
  phone?: string;
  // add anything else you use in your form...
};

type HubSpotBatchContactInput = {
  properties: Record<string, string>;
};

function toHubSpotProperties(data: ApplicationContact): Record<string, string> {
  const p: Record<string, string> = {};

  // ✅ camelCase -> HubSpot faces_* (snake_case)
  if (data.firstName) p["faces_first_name"] = data.firstName;
  if (data.middleName) p["faces_middle_name"] = data.middleName;
  if (data.lastName) p["faces_last_name"] = data.lastName;

  if (data.email) p["email"] = data.email;
  if (data.phone) p["faces_mobile"] = data.phone;

  return p;
}

/**
 * IMPORTANT:
 * This must only be called server-side (API route / server action),
 * because it uses HUBSPOT_ACCESS_TOKEN.
 */
export async function syncToHubSpot(data: ApplicationContact) {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    // Fail loudly on server so you notice missing env var on Vercel
    throw new Error("Missing HUBSPOT_ACCESS_TOKEN env var");
  }

  const contact: HubSpotBatchContactInput = {
    properties: toHubSpotProperties(data),
  };

  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot sync failed: ${res.status} ${text}`);
  }

  return res.json();
}
