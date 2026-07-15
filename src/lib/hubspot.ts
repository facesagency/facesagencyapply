/**
 * HubSpot Integration Service
 *
 * Syncs form submissions to HubSpot as contacts.
 * HubSpot is the single source of truth for all customer data.
 *
 * Multi-select properties receive semicolon-separated values (HubSpot wire format).
 * Duplicate detection follows the FAMILY RULE:
 *   same phone + same first name + same date of birth  -> same person (update)
 *   same phone + different name/DOB                    -> family member (create new)
 */

const SERVERLESS_ENDPOINT = '/api/hubspot-submit';

export function calculateAgeCategory(dateOfBirth: string): string {
  if (!dateOfBirth) return '';
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age >= 0 && age <= 2) return 'Babies (0-2)';
  if (age >= 3 && age <= 12) return 'Kids (3-12)';
  if (age >= 13 && age <= 17) return 'Teens (13-17)';
  if (age >= 18 && age <= 25) return 'Young Adult (18-25)';
  if (age >= 26 && age <= 40) return 'Adult (26-40)';
  if (age >= 41 && age <= 55) return 'Mature (41-55)';
  if (age >= 56) return 'Senior (56+)';
  return '';
}

function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const today = new Date();
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/**
 * Capitalize first letter of each word (for HubSpot enum fields)
 */
function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Map form yes/no strings to HubSpot dropdown options ("Yes"/"No"/"Maybe"/"Want to know more") */
function toOption(value: string): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    yes: 'Yes',
    no: 'No',
    maybe: 'Maybe',
    more: 'Want to know more',
  };
  return map[value] || capitalizeWords(value);
}

/** Multi-select wire format: semicolon-separated values */
function toMultiSelect(values: string[]): string | undefined {
  const clean = (values || []).filter(Boolean);
  return clean.length > 0 ? clean.join(';') : undefined;
}

function getHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

/** Detect office-mode applications via ?source=office in the URL */
function getApplicationSource(): string {
  try {
    const source = new URLSearchParams(window.location.search).get('source');
    return source === 'office' ? 'office' : 'website';
  } catch {
    return 'website';
  }
}

export interface FormData {
  gender: "" | "male" | "female";
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
  governorate: string;
  district: string;
  area: string;
  languages: string[];
  otherLanguages: string[];
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
  danceStyles: string[];
  musicalInstruments: string[];
  instrumentLevels: Record<string, number>;
  experience: string;
  cameraConfidence: number;
  interestedInExtra: string;
  willingShaveBeard: string;
  aiProjectsInterest: string;
  alcoholAdsOk: string;
  sports: string[];
  hasCar: string;
  hasLicense: string;
  canTravel: string;
  hasPassport: string;
  hasMultiplePassports: string;
  passports: string[];
  visasHeld: string[];
  visaExpiries: Record<string, string>;
  hasLookAlikeTwin: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
}

interface HubSpotContactProperties {
  [key: string]: string | undefined;
}

/**
 * Transform form data to HubSpot contact properties
 */
export function transformToHubSpotProperties(
  formData: FormData,
  talentId?: string
): HubSpotContactProperties {
  const age = calculateAge(formData.dateOfBirth);

  // Merge main + other languages into one clean multi-select value
  const allLanguages = [
    ...(formData.languages || []),
    ...(formData.otherLanguages || []),
  ].filter((l, i, arr) => l && arr.indexOf(l) === i);

  return {
    // HubSpot built-in properties
    email: formData.email || undefined,
    firstname: formData.firstName,
    lastname: formData.lastName,
    phone: `${formData.mobileCountryCode} ${formData.mobile}`,

    // Personal Info
    faces_gender: formData.gender || undefined,
    faces_middle_name: formData.middleName,
    faces_date_of_birth: formData.dateOfBirth,
    faces_nationality: formData.nationality,

    // Contact Info
    faces_mobile: `${formData.mobileCountryCode} ${formData.mobile}`,
    faces_whatsapp: `${formData.whatsappCountryCode} ${formData.whatsapp}`,
    faces_other_number: formData.otherNumber
      ? `${formData.otherNumberCountryCode} ${formData.otherNumber}`
      : undefined,
    faces_other_number_relationship: formData.otherNumberRelationship
      ? capitalizeWords(formData.otherNumberRelationship)
      : undefined,
    faces_other_number_person_name: formData.otherNumberPersonName || undefined,
    faces_instagram: formData.instagram || undefined,

    // Location
    faces_governorate: formData.governorate,
    faces_district: formData.district,
    faces_area: formData.area,

    // Languages — multi-select (semicolon-separated); levels stay JSON metadata
    faces_languages: toMultiSelect(allLanguages),
    faces_language_levels: Object.keys(formData.languageLevels || {}).length > 0
      ? JSON.stringify(formData.languageLevels)
      : undefined,

    // Appearance — always send the selected enum value; free-text customs are
    // never sent into enum properties (they would be rejected by HubSpot)
    faces_eye_color: formData.eyeColor || undefined,
    faces_hair_color: formData.hairColor || undefined,
    faces_hair_type: formData.hairType ? capitalizeWords(formData.hairType) : undefined,
    faces_hair_length: formData.hairLength ? capitalizeWords(formData.hairLength) : undefined,
    faces_skin_tone: formData.skinTone || undefined,
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

    // Talents & Skills — multi-selects (semicolon-separated)
    faces_talents: toMultiSelect(formData.talents),
    dance_styles: toMultiSelect(formData.danceStyles),
    musical_instruments: toMultiSelect(formData.musicalInstruments),
    instrument_levels: Object.keys(formData.instrumentLevels || {}).length > 0
      ? JSON.stringify(formData.instrumentLevels)
      : undefined,
    faces_sports: toMultiSelect(formData.sports),
    faces_has_modeling_experience: formData.experience === 'yes' ? 'yes' : 'no',
    faces_interested_in_extra_work: formData.interestedInExtra || undefined,
    faces_camera_confidence: formData.cameraConfidence ? String(formData.cameraConfidence) : undefined,

    // New casting questions (age/gender-conditional; only sent when answered)
    willing_to_shave_beard: formData.gender === 'male' && age !== null && age >= 13
      ? toOption(formData.willingShaveBeard)
      : undefined,
    faces_ai_projects_interest: toOption(formData.aiProjectsInterest),
    faces_alcohol_ads_ok: age !== null && age >= 18
      ? toOption(formData.alcoholAdsOk)
      : undefined,

    // Availability
    faces_has_car: formData.hasCar || undefined,
    faces_has_driving_license: formData.hasLicense || undefined,
    faces_willing_to_travel: formData.canTravel || undefined,
    faces_has_valid_passport: formData.hasPassport || undefined,
    faces_has_multiple_passports: formData.hasMultiplePassports || undefined,
    faces_passport_countries: toMultiSelect(formData.passports),
    faces_visas_held: toMultiSelect(formData.visasHeld),
    faces_visa_expiries: Object.keys(formData.visaExpiries || {}).length > 0
      ? JSON.stringify(formData.visaExpiries)
      : undefined,
    faces_has_look_alike_twin: formData.hasLookAlikeTwin || undefined,

    // Referral — send the selection only; free text goes to its own field, never
    // concatenated into the dropdown value
    faces_how_did_you_hear: formData.howDidYouHear || undefined,

    // System fields
    age_category: formData.dateOfBirth ? calculateAgeCategory(formData.dateOfBirth) : undefined,
    faces_application_date: new Date().toISOString(),
    faces_application_source: getApplicationSource(),
    talent_id: talentId || undefined,
  };
}

/**
 * Clean properties object - remove undefined/null/empty values
 */
function cleanProperties(props: HubSpotContactProperties): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== null) {
      const strValue = String(value).trim();
      if (strValue !== '' && strValue !== '[]' && strValue !== '{}') {
        cleaned[key] = strValue;
      }
    }
  }
  return cleaned;
}

/**
 * FAMILY-RULE duplicate detection.
 * Searches HubSpot by the applicant's phone numbers, then only treats a result
 * as "the same person" when first name AND date of birth also match.
 * One family sharing a phone number = multiple distinct contacts, no error.
 */
async function findSamePersonByPhone(
  mobileNumber: string,
  whatsappNumber: string,
  firstName: string,
  dateOfBirth: string
): Promise<string | null> {
  try {
    const searchParams = {
      filterGroups: [
        { filters: [{ propertyName: 'faces_mobile', operator: 'EQ', value: mobileNumber }] },
        { filters: [{ propertyName: 'faces_whatsapp', operator: 'EQ', value: whatsappNumber }] },
        { filters: [{ propertyName: 'phone', operator: 'EQ', value: mobileNumber }] },
      ],
      properties: ['firstname', 'faces_date_of_birth'],
      limit: 50,
    };

    const response = await fetch(SERVERLESS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action: 'search', searchParams }),
    });

    if (!response.ok) {
      console.error('[HubSpot] Search error:', await response.text());
      return null;
    }

    const data = await response.json();
    const results = data.data?.results || [];
    console.log('[HubSpot] Phone matches found:', results.length);

    const normalizedFirst = (firstName || '').trim().toLowerCase();
    for (const contact of results) {
      const candidateFirst = (contact.properties?.firstname || '').trim().toLowerCase();
      const candidateDob = (contact.properties?.faces_date_of_birth || '').trim();
      if (candidateFirst === normalizedFirst && candidateDob === dateOfBirth.trim()) {
        console.log('[HubSpot] Same person found (phone + name + DOB match):', contact.id);
        return contact.id;
      }
    }
    // Phone matched but name/DOB did not -> family member, create a new contact
    return null;
  } catch (error) {
    console.error('[HubSpot] Error searching contact:', error);
    return null;
  }
}

async function createContact(
  properties: Record<string, string>
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    const response = await fetch(SERVERLESS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action: 'create', properties }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[HubSpot] Create error:', errorData);
      return { success: false, error: errorData };
    }
    const data = await response.json();
    return { success: true, contactId: data.contactId };
  } catch (error) {
    console.error('Error creating HubSpot contact:', error);
    return { success: false, error: String(error) };
  }
}

async function updateContact(
  contactId: string,
  properties: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(SERVERLESS_ENDPOINT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action: 'update', contactId, properties }),
    });
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
 * Sync form submission to HubSpot (family-rule upsert)
 */
export async function syncToHubSpot(
  formData: FormData,
  talentId?: string
): Promise<{ success: boolean; contactId?: string; error?: string; isUpdate?: boolean }> {
  console.log('[HubSpot] ========== Starting sync ==========');
  try {
    const hubspotProperties = transformToHubSpotProperties(formData, talentId);
    const cleanedProperties = cleanProperties(hubspotProperties);
    console.log('[HubSpot] Cleaned properties count:', Object.keys(cleanedProperties).length);

    const mobileNumber = `${formData.mobileCountryCode} ${formData.mobile}`;
    const whatsappNumber = `${formData.whatsappCountryCode} ${formData.whatsapp}`;

    const existingContactId = await findSamePersonByPhone(
      mobileNumber,
      whatsappNumber,
      formData.firstName,
      formData.dateOfBirth
    );

    if (existingContactId) {
      console.log('[HubSpot] Updating existing contact (same person re-applying)...');
      // Never overwrite an existing talent_id when re-applying
      const updateProps = { ...cleanedProperties };
      delete updateProps.talent_id;
      const result = await updateContact(existingContactId, updateProps);
      return { ...result, contactId: existingContactId, isUpdate: true };
    }

    console.log('[HubSpot] Creating new contact...');
    const result = await createContact(cleanedProperties);
    return { ...result, isUpdate: false };
  } catch (error) {
    console.error('[HubSpot] UNEXPECTED ERROR:', error);
    return { success: false, error: String(error) };
  }
}
