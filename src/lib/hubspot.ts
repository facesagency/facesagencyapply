// ✅ Your app uses camelCase
export interface ApplicationContact {
  firstName?: string;
  middleName?: string;
  lastName?: string;

  // add other app fields you actually use:
  // gender?: string;
  // phone?: string;
  // instagram?: string;
}

// ✅ HubSpot expects faces_* snake_case keys
export interface HubSpotContactPayload {
  properties: Record<string, string>;
}

// ✅ Make sure this export exists (this is what your build error points to)
export async function syncToHubSpot(data: ApplicationContact) {
  const properties: Record<string, string> = {};

  // map camelCase -> HubSpot faces_* properties
  if (data.firstName) properties["faces_first_name"] = data.firstName;
  if (data.middleName) properties["faces_middle_name"] = data.middleName;
  if (data.lastName) properties["faces_last_name"] = data.lastName;

  // TODO: add other mappings here as needed

  // return whatever your app expects
  return { ok: true, properties };
}
