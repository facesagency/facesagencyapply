/**
 * HubSpot Integration Service
 *
 * Syncs form submissions to HubSpot as contacts.
 * HubSpot is the single source of truth for all customer data.
 *
 * NOTE: Browser-based calls use a CORS proxy or serverless function
 * since HubSpot's CRM API doesn't support browser CORS.
 */

// In development: use Vite proxy to HubSpot API directly
// In production: use our serverless function at /api/hubspot-submit
const IS_DEV = import.meta.env.DEV;
const HUBSPOT_API_URL = IS_DEV ? '/api/hubspot' : '';
const SERVERLESS_ENDPOINT = '/api/hubspot-submit';

/**
 * Capitalize first letter of each word (for HubSpot enum fields)
 * "mother" -> "Mother", "dark brown" -> "Dark Brown"
 */
function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get headers for HubSpot API requests
 * In dev mode, proxy adds Authorization. In production, serverless handles auth.
 */
function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
  };
}

interface HubSpotContactProperties {
  // HubSpot built-in properties (no prefix, lowercase)
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;

  // Custom Properties - All use faces_ prefix with snake_case
  // Personal Info
  faces_gender?: string;
  faces_first_name?: string;
  faces_middle_name?: string;
  faces_last_name?: string;
  faces_date_of_birth?: string;
  faces_nationality?: string;

  // Contact Info
  faces_mobile?: string;
  faces_whatsapp?: string;
  faces_other_number?: string;
  faces_other_number_relationship?: string;
  faces_other_number_person_name?: string;
  faces_instagram?: string;
  faces_has_whish_account?: string;
  faces_whish_number?: string;

  // Location
  faces_governorate?: string;
  faces_district?: string;
  faces_area?: string;

  // Languages
  faces_languages?: string;
  faces_language_levels?: string;

  // Appearance
  faces_eye_color?: string;
  faces_hair_color?: string;
  faces_hair_type?: string;
  faces_hair_length?: string;
  faces_skin_tone?: string;
  faces_has_tattoos?: string;
  faces_has_piercings?: string;

  // Measurements
  faces_height_cm?: string;
  faces_weight_kg?: string;
  faces_pant_size?: string;
  faces_jacket_size?: string;
  faces_shoe_size?: string;
  faces_bust_cm?: string;
  faces_waist_cm?: string;
  faces_hips_cm?: string;
  faces_shoulders_cm?: string;

  // Talents & Skills
  faces_talents?: string;
  faces_talent_levels?: string;
  faces_sports?: string;
  faces_sport_levels?: string;
  faces_modeling_types?: string;
  faces_has_modeling_experience?: string;
  faces_modeling_experience_details?: string;
  faces_comfortable_with_swimwear?: string;
  faces_interested_in_extra_work?: string;
  faces_camera_confidence?: string;

  // Availability
  faces_has_car?: string;
  faces_has_driving_license?: string;
  faces_willing_to_travel?: string;
  faces_has_valid_passport?: string;
  faces_has_multiple_passports?: string;
  faces_passport_countries?: string;
  faces_has_look_alike_twin?: string;

  // Referral
  faces_how_did_you_hear?: string;

  // System
  faces_application_date?: string;
  faces_application_source?: string;}

interface FormData {
  gender: "male" | "female";
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  mobile: string;
  mobileCountryCode: string;
  whatsapp: string;
  whatsappCountryCode: string;
  otherNumber: string;
  otherNumberCountryCode: string;
  otherNumberRelationship: string;
  otherNumberPersonName: string;
  instagram: string;
  hasWhishAccount: string;
  whishNumber: string;
  whishCountryCode: string;
  governorate: string;
  district: string;
  area: string;
  languages: string[];
  languageLevels: Record<string, number>;
  customLanguage: string;
  height: string;
  weight: string;
  pantSize: string;
  jacketSize: string;
  shoeSize: string;
  bust: string;
  waist: string;
  hips: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  hairLength: string;
  skinTone: string;
  hasTattoos: boolean;
  hasPiercings: boolean;
  customEyeColor: string;
  customHairColor: string;
  shoulders: string;
  talents: string[];
  talentLevels: Record<string, number>;
  sports: string[];
  sportLevels: Record<string, number>;
  modeling: string[];
  customTalent: string;
  customSport: string;
  customModeling: string;
  experience: string;
  cameraConfidence: number;
  interestedInExtra: string;
  hasCar: string;
  hasLicense: string;
  isEmployed: string;
  canTravel: string;
  hasPassport: string;
  hasMultiplePassports: string;
  passports: string[];
  comfortableWithSwimwear: boolean | null;
  hasLookAlikeTwin: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
}

/**
 * Transform form data to HubSpot contact properties
 */
export function transformToHubSpotProperties(
  formData: FormData,
): HubSpotContactProperties {
  return {
    // HubSpot built-in properties (no prefix, lowercase)
    email: formData.email,
    firstname: formData.firstName,
    lastname: formData.lastName,
    phone: `${formData.mobileCountryCode} ${formData.mobile}`,

    // Personal Info - all use faces_ prefix
    faces_gender: formData.gender,
    faces_middle_name: formData.middleName,
    faces_date_of_birth: formData.dateOfBirth,
    faces_nationality: formData.nationality,

    // Contact Info - combine country code with number
    faces_mobile: `${formData.mobileCountryCode} ${formData.mobile}`,
    faces_whatsapp: `${formData.whatsappCountryCode} ${formData.whatsapp}`,
    faces_other_number: formData.otherNumber
      ? `${formData.otherNumberCountryCode} ${formData.otherNumber}`
      : undefined,
    // Capitalize relationship for HubSpot enum (Mother, Father, etc.)
    faces_other_number_relationship: formData.otherNumberRelationship
      ? capitalizeWords(formData.otherNumberRelationship)
      : undefined,
    faces_other_number_person_name: formData.otherNumberPersonName || undefined,
    faces_instagram: formData.instagram || undefined,
    faces_has_whish_account: formData.hasWhishAccount || undefined,
    faces_whish_number: formData.whishNumber
      ? `${formData.whishCountryCode} ${formData.whishNumber}`
      : undefined,

    // Location
    faces_governorate: formData.governorate,
    faces_district: formData.district,
    faces_area: formData.area,

    // Languages - store as JSON strings (only if non-empty)
    faces_languages: formData.languages.length > 0 ? JSON.stringify(formData.languages) : undefined,
    faces_language_levels: Object.keys(formData.languageLevels).length > 0
      ? JSON.stringify(formData.languageLevels) : undefined,

    // Appearance - use custom values if provided
    // Capitalize enum fields for HubSpot (Straight, Wavy, Short, Medium, etc.)
    faces_eye_color: formData.customEyeColor || formData.eyeColor,
    faces_hair_color: formData.customHairColor || formData.hairColor,
    faces_hair_type: formData.hairType ? capitalizeWords(formData.hairType) : undefined,
    faces_hair_length: formData.hairLength ? capitalizeWords(formData.hairLength) : undefined,
    faces_skin_tone: formData.skinTone,
    faces_has_tattoos: formData.hasTattoos ? 'true' : 'false',
    faces_has_piercings: formData.hasPiercings ? 'true' : 'false',

    // Measurements
    faces_height_cm: formData.height,
    faces_weight_kg: formData.weight,
    faces_pant_size: formData.pantSize,
    faces_jacket_size: formData.jacketSize,
    faces_shoe_size: formData.shoeSize,
    faces_bust_cm: formData.bust || undefined,
    faces_waist_cm: formData.waist || undefined,
    faces_hips_cm: formData.hips || undefined,
    faces_shoulders_cm: formData.shoulders || undefined,

    // Talents & Skills - store as JSON strings
    faces_talents: formData.talents.length > 0 ? JSON.stringify(formData.talents) : undefined,
    faces_talent_levels: Object.keys(formData.talentLevels).length > 0
      ? JSON.stringify(formData.talentLevels)
      : undefined,
    faces_sports: formData.sports.length > 0 ? JSON.stringify(formData.sports) : undefined,
    faces_sport_levels: Object.keys(formData.sportLevels).length > 0
      ? JSON.stringify(formData.sportLevels)
      : undefined,
    faces_modeling_types: formData.modeling.length > 0 ? JSON.stringify(formData.modeling) : undefined,
    faces_has_modeling_experience: formData.experience ? 'yes' : 'no',
    faces_modeling_experience_details: formData.experience || undefined,
    faces_comfortable_with_swimwear: formData.comfortableWithSwimwear !== null
      ? String(formData.comfortableWithSwimwear)
      : undefined,
    faces_interested_in_extra_work: formData.interestedInExtra || undefined,
    faces_camera_confidence: formData.cameraConfidence ? String(formData.cameraConfidence) : undefined,

    // Availability
    faces_has_car: formData.hasCar || undefined,
    faces_has_driving_license: formData.hasLicense || undefined,
    faces_willing_to_travel: formData.canTravel || undefined,
    faces_has_valid_passport: formData.hasPassport || undefined,
    faces_has_multiple_passports: formData.hasMultiplePassports || undefined,
    faces_passport_countries: formData.passports.length > 0
      ? JSON.stringify(formData.passports)
      : undefined,
    faces_has_look_alike_twin: formData.hasLookAlikeTwin || undefined,

    // Referral
    faces_how_did_you_hear: formData.howDidYouHear
      ? (formData.howDidYouHear === "Other" && formData.howDidYouHearOther
        ? `Other: ${formData.howDidYouHearOther}`
        : formData.howDidYouHear)
      : undefined,

    // System fields
    faces_application_date: new Date().toISOString(),
    faces_application_source: 'website',  };
}

/**
 * Clean properties object - remove undefined/null/empty values
 */
function cleanProperties(props: HubSpotContactProperties): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== null) {
      const strValue = String(value).trim();
      // Skip empty strings but allow "[]" for empty arrays if needed
      if (strValue !== '' && strValue !== '[]' && strValue !== '{}') {
        cleaned[key] = strValue;
      }
    }
  }
  console.log('[HubSpot] Cleaned properties:', cleaned);
  return cleaned;
}

/**
 * Search for existing contact by phone number
 */
async function searchContactByPhone(
  phoneNumber: string
): Promise<string | null> {
  try {
    const searchParams = {
      filterGroups: [
        {
          filters: [
            { propertyName: 'mobile', operator: 'EQ', value: phoneNumber },
          ],
        },
        {
          filters: [
            { propertyName: 'whatsapp', operator: 'EQ', value: phoneNumber },
          ],
        },
      ],
    };

    let response: Response;

    if (IS_DEV) {
      // Dev: use Vite proxy directly to HubSpot
      const url = `${HUBSPOT_API_URL}/crm/v3/objects/contacts/search`;
      console.log('[HubSpot] Search URL:', url);
      response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(searchParams),
      });
    } else {
      // Production: use serverless function
      response = await fetch(SERVERLESS_ENDPOINT, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'search', searchParams }),
      });
    }

    console.log('[HubSpot] Search response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[HubSpot] Search error:', errorText);
      return null;
    }

    const data = await response.json();
    // Production serverless returns { success, data } wrapper
    const results = IS_DEV ? data.results : data.data?.results;
    console.log('[HubSpot] Search results count:', results?.length || 0);
    if (results && results.length > 0) {
      return results[0].id;
    }
    return null;
  } catch (error) {
    console.error('[HubSpot] Error searching contact:', error);
    return null;
  }
}

/**
 * Create a new contact in HubSpot
 */
async function createContact(
  properties: Record<string, string>
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    let response: Response;

    if (IS_DEV) {
      // Dev: use Vite proxy directly to HubSpot
      const url = `${HUBSPOT_API_URL}/crm/v3/objects/contacts`;
      console.log('[HubSpot] Create URL:', url);
      response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      });
    } else {
      // Production: use serverless function
      response = await fetch(SERVERLESS_ENDPOINT, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'create', properties }),
      });
    }

    console.log('[HubSpot] Create response status:', response.status);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[HubSpot] Create error:', errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();
    // Production serverless returns { success, contactId } directly
    const contactId = IS_DEV ? data.id : data.contactId;
    return { success: true, contactId };
  } catch (error) {
    console.error('Error creating HubSpot contact:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update an existing contact in HubSpot
 */
async function updateContact(
  contactId: string,
  properties: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    let response: Response;

    if (IS_DEV) {
      // Dev: use Vite proxy directly to HubSpot
      response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ properties }),
      });
    } else {
      // Production: use serverless function
      response = await fetch(SERVERLESS_ENDPOINT, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'update', contactId, properties }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HubSpot update error:', errorData);
      return { success: false, error: errorData };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating HubSpot contact:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Sync form submission to HubSpot
 * Creates a new contact or updates existing one (upsert)
 */
export async function syncToHubSpot(
  formData: FormData,

): Promise<{ success: boolean; contactId?: string; error?: string }> {
  console.log('[HubSpot] ========== Starting sync ==========');
  console.log('[HubSpot] IS_DEV:', IS_DEV);
  console.log('[HubSpot] Form data received:', JSON.stringify(formData, null, 2));

  // In dev mode, check for access token (proxy needs it)
  // In production, serverless function has the token
  if (IS_DEV) {
    const accessToken = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN;
    console.log('[HubSpot] Access token exists:', !!accessToken);
    if (!accessToken) {
      console.warn('[HubSpot] Access token not configured - skipping sync');
      return { success: true };
    }
  }

  try {
    console.log('[HubSpot] Transforming form data to HubSpot properties...');
    console.log('[HubSpot] Raw transformed properties:', JSON.stringify(hubspotProperties, null, 2));

    const cleanedProperties = cleanProperties(hubspotProperties);
    console.log('[HubSpot] Cleaned properties count:', Object.keys(cleanedProperties).length);
    console.log('[HubSpot] Cleaned properties:', JSON.stringify(cleanedProperties, null, 2));

    // Search for existing contact by mobile number
    const mobileNumber = `${formData.mobileCountryCode} ${formData.mobile}`;
    console.log('[HubSpot] Searching for existing contact with mobile:', mobileNumber);

    const existingContactId = await searchContactByPhone(mobileNumber);
    console.log('[HubSpot] Existing contact ID:', existingContactId);

    if (existingContactId) {
      // Update existing contact
      console.log('[HubSpot] Updating existing contact...');
      const result = await updateContact(existingContactId, cleanedProperties);
      console.log('[HubSpot] Update result:', JSON.stringify(result));
      return { ...result, contactId: existingContactId };
    } else {
      // Create new contact
      console.log('[HubSpot] Creating new contact...');
      const result = await createContact(cleanedProperties);
      console.log('[HubSpot] Create result:', JSON.stringify(result));
      return result;
    }
  } catch (error) {
    console.error('[HubSpot] ========== UNEXPECTED ERROR ==========');
    console.error('[HubSpot] Error type:', typeof error);
    console.error('[HubSpot] Error:', error);
    console.error('[HubSpot] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[HubSpot] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return { success: false, error: String(error) };
  }
}

/**
 * Batch sync multiple contacts to HubSpot (for Excel imports)
 */
export async function batchSyncToHubSpot(
  contacts: Array<Record<string, string>>,
  accessToken: string
): Promise<{ success: boolean; created: number; updated: number; errors: string[] }> {
  const results = {
    success: true,
    created: 0,
    updated: 0,
    errors: [] as string[],
  };

  // HubSpot batch API has limits, process in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < contacts.length; i += chunkSize) {
    const chunk = contacts.slice(i, i + chunkSize);

    try {
      const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/batch/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: chunk.map(properties => ({ properties })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        results.errors.push(`Batch ${i / chunkSize + 1}: ${errorData}`);
        results.success = false;
      } else {
        const data = await response.json();
        results.created += data.results?.length || 0;
      }
    } catch (error) {
      results.errors.push(`Batch ${i / chunkSize + 1}: ${String(error)}`);
      results.success = false;
    }
  }

  return results;
}
