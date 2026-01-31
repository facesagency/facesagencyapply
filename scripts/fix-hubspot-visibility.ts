/**
 * Fix HubSpot property visibility
 * Updates all faces_ properties to show in the contact record view
 *
 * Run: HUBSPOT_ACCESS_TOKEN=pat-eu1-... npx tsx scripts/fix-hubspot-visibility.ts
 */

const HUBSPOT_API_URL = 'https://api.hubapi.com';

const properties = [
  'faces_application_date',
  'faces_application_source',
  'faces_area',
  'faces_bust_cm',
  'faces_comfortable_with_swimwear',
  'faces_date_of_birth',
  'faces_district',
  'faces_eye_color',
  'faces_gender',
  'faces_governorate',
  'faces_hair_color',
  'faces_hair_length',
  'faces_hair_type',
  'faces_has_car',
  'faces_has_driving_license',
  'faces_has_modeling_experience',
  'faces_has_multiple_passports',
  'faces_has_piercings',
  'faces_has_tattoos',
  'faces_has_valid_passport',
  'faces_has_whish_account',
  'faces_height_cm',
  'faces_hips_cm',
  'faces_instagram',
  'faces_interested_in_extra_work',
  'faces_jacket_size',
  'faces_language_levels',
  'faces_languages',
  'faces_middle_name',
  'faces_mobile',
  'faces_modeling_types',
  'faces_nationality',
  'faces_other_number',
  'faces_other_number_person_name',
  'faces_other_number_relationship',
  'faces_pant_size',
  'faces_passport_countries',
  'faces_shoe_size',
  'faces_shoulders_cm',
  'faces_skin_tone',
  'faces_sport_levels',
  'faces_sports',
  'faces_supabase_id',
  'faces_talent_levels',
  'faces_talents',
  'faces_waist_cm',
  'faces_weight_kg',
  'faces_whatsapp',
  'faces_whish_number',
  'faces_willing_to_travel',
];

async function updateProperty(name: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/properties/contacts/${name}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formField: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to update ${name}:`, error);
      return false;
    }

    console.log(`✓ Updated ${name}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${name}:`, error);
    return false;
  }
}

async function main() {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('HUBSPOT_ACCESS_TOKEN environment variable not set');
    process.exit(1);
  }

  console.log(`Updating ${properties.length} properties to show in contact view...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const prop of properties) {
    const success = await updateProperty(prop, accessToken);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\nDone! Updated: ${successCount}, Failed: ${failCount}`);
}

main().catch(console.error);
