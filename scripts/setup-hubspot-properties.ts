/**
 * HubSpot Properties Setup Script
 *
 * Creates all custom contact properties required for Faces Agency
 * Run once to set up HubSpot schema.
 *
 * Usage: HUBSPOT_ACCESS_TOKEN=xxx npx ts-node scripts/setup-hubspot-properties.ts
 */

const HUBSPOT_API_URL = 'https://api.hubapi.com';

interface PropertyDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'datetime' | 'enumeration' | 'bool';
  fieldType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'booleancheckbox' | 'checkbox';
  groupName: string;
  description?: string;
  options?: Array<{ label: string; value: string }>;
}

const PROPERTY_GROUP = {
  name: 'faces_agency',
  label: 'Faces Agency',
};

const PROPERTIES: PropertyDefinition[] = [
  // Personal Information
  // Note: firstname, lastname use HubSpot built-in properties
  // faces_gender uses unique label to avoid conflict with HubSpot's gender property
  {
    name: 'faces_gender',
    label: 'Candidate Gender',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
  {
    name: 'faces_middle_name',
    label: 'Middle Name',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    fieldType: 'date',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_nationality',
    label: 'Nationality',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },

  // Contact Information
  {
    name: 'faces_mobile',
    label: 'Mobile Number',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
    description: 'Full phone number with country code',
  },
  {
    name: 'faces_whatsapp',
    label: 'WhatsApp Number',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
    description: 'Full WhatsApp number with country code',
  },
  {
    name: 'faces_other_number',
    label: 'Emergency Contact Number',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_other_number_relationship',
    label: 'Emergency Contact Relationship',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Mother', value: 'Mother' },
      { label: 'Father', value: 'Father' },
      { label: 'Son', value: 'Son' },
      { label: 'Daughter', value: 'Daughter' },
      { label: 'Brother', value: 'Brother' },
      { label: 'Sister', value: 'Sister' },
      { label: 'Uncle', value: 'Uncle' },
      { label: 'Aunt', value: 'Aunt' },
      { label: 'Cousin', value: 'Cousin' },
      { label: 'Grandfather', value: 'Grandfather' },
      { label: 'Grandmother', value: 'Grandmother' },
      { label: 'Spouse', value: 'Spouse' },
      { label: 'Friend', value: 'Friend' },
      { label: 'Colleague', value: 'Colleague' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    name: 'faces_other_number_person_name',
    label: 'Emergency Contact Name',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_instagram',
    label: 'Instagram Username',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_has_whish_account',
    label: 'Has WHISH Account',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_whish_number',
    label: 'WHISH Number',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },

  // Location
  {
    name: 'faces_governorate',
    label: 'Governorate',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
    description: 'Lebanese governorate',
  },
  {
    name: 'faces_district',
    label: 'District',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_area',
    label: 'Area',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },

  // Languages
  {
    name: 'faces_languages',
    label: 'Languages',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON array of languages spoken',
  },
  {
    name: 'faces_language_levels',
    label: 'Language Proficiency Levels',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON object mapping language to proficiency (1-5 scale)',
  },

  // Appearance
  {
    name: 'faces_eye_color',
    label: 'Eye Color',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_hair_color',
    label: 'Hair Color',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_hair_type',
    label: 'Hair Type',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Straight', value: 'Straight' },
      { label: 'Wavy', value: 'Wavy' },
      { label: 'Curly', value: 'Curly' },
      { label: 'Coily', value: 'Coily' },
    ],
  },
  {
    name: 'faces_hair_length',
    label: 'Hair Length',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Bald', value: 'Bald' },
      { label: 'Buzz Cut', value: 'Buzz Cut' },
      { label: 'Short', value: 'Short' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Long', value: 'Long' },
      { label: 'Very Long', value: 'Very Long' },
    ],
  },
  {
    name: 'faces_skin_tone',
    label: 'Skin Tone',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_has_tattoos',
    label: 'Has Tattoos',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
  },
  {
    name: 'faces_has_piercings',
    label: 'Has Piercings',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
  },

  // Measurements
  {
    name: 'faces_height_cm',
    label: 'Height (cm)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_weight_kg',
    label: 'Weight (kg)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_pant_size',
    label: 'Pant Size',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_jacket_size',
    label: 'Jacket Size',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_shoe_size',
    label: 'Shoe Size',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_bust_cm',
    label: 'Bust (cm)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_waist_cm',
    label: 'Waist (cm)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_hips_cm',
    label: 'Hips (cm)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },
  {
    name: 'faces_shoulders_cm',
    label: 'Shoulders (cm)',
    type: 'number',
    fieldType: 'number',
    groupName: 'faces_agency',
  },

  // Talents & Skills
  {
    name: 'faces_talents',
    label: 'Talents',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON array of talents',
  },
  {
    name: 'faces_talent_levels',
    label: 'Talent Proficiency Levels',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON object mapping talent to proficiency (1-5 scale)',
  },
  {
    name: 'faces_sports',
    label: 'Sports',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON array of sports',
  },
  {
    name: 'faces_sport_levels',
    label: 'Sport Proficiency Levels',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON object mapping sport to proficiency (1-5 scale)',
  },
  {
    name: 'faces_modeling_types',
    label: 'Modeling Types',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON array of modeling types',
  },
  {
    name: 'faces_has_modeling_experience',
    label: 'Has Modeling Experience',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_comfortable_with_swimwear',
    label: 'Comfortable with Swimwear',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
  },
  {
    name: 'faces_interested_in_extra_work',
    label: 'Interested in Extra Work',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },

  // Availability & Travel
  {
    name: 'faces_has_car',
    label: 'Has Car',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_has_driving_license',
    label: 'Has Driving License',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_willing_to_travel',
    label: 'Willing to Travel',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_has_valid_passport',
    label: 'Has Valid Passport',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_has_multiple_passports',
    label: 'Has Multiple Passports',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    name: 'faces_passport_countries',
    label: 'Passport Countries',
    type: 'string',
    fieldType: 'textarea',
    groupName: 'faces_agency',
    description: 'JSON array of passport countries',
  },
  {
    name: 'faces_has_look_alike_twin',
    label: 'Has Look-Alike Twin',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },

  // Referral
  {
    name: 'faces_how_did_you_hear',
    label: 'How Did You Hear About Us',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    description: 'Marketing attribution - how the candidate found Faces Agency',
    options: [
      { label: 'Instagram', value: 'Instagram' },
      { label: 'Facebook', value: 'Facebook' },
      { label: 'TikTok', value: 'TikTok' },
      { label: 'Friend or Family', value: 'Friend or Family' },
      { label: 'Google Search', value: 'Google Search' },
      { label: 'Event or Casting Call', value: 'Event or Casting Call' },
      { label: 'Other', value: 'Other' },
    ],
  },

  // System Fields
  {
    name: 'faces_application_date',
    label: 'Application Date',
    type: 'datetime',
    fieldType: 'date',
    groupName: 'faces_agency',
    description: 'When the application was submitted',
  },
  {
    name: 'faces_application_source',
    label: 'Application Source',
    type: 'enumeration',
    fieldType: 'select',
    groupName: 'faces_agency',
    options: [
      { label: 'Website', value: 'website' },
      { label: 'Excel Import', value: 'excel_import' },
      { label: 'Manual Entry', value: 'manual' },
    ],
  },
  {
    name: 'faces_supabase_id',
    label: 'Supabase Record ID',
    type: 'string',
    fieldType: 'text',
    groupName: 'faces_agency',
    description: 'Links to Supabase applications table',
  },
];

async function createPropertyGroup(accessToken: string): Promise<boolean> {
  console.log(`Creating property group: ${PROPERTY_GROUP.label}...`);

  try {
    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/properties/contacts/groups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(PROPERTY_GROUP),
    });

    if (response.status === 409) {
      console.log('  Property group already exists, skipping...');
      return true;
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(`  Failed to create group: ${error}`);
      return false;
    }

    console.log('  Property group created successfully!');
    return true;
  } catch (error) {
    console.error(`  Error creating group: ${error}`);
    return false;
  }
}

async function createProperty(property: PropertyDefinition, accessToken: string): Promise<boolean> {
  const payload: Record<string, unknown> = {
    name: property.name,
    label: property.label,
    type: property.type,
    fieldType: property.fieldType,
    groupName: property.groupName,
  };

  if (property.description) {
    payload.description = property.description;
  }

  if (property.options) {
    payload.options = property.options;
  }

  try {
    const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/properties/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 409) {
      console.log(`  [SKIP] ${property.name} - already exists`);
      return true;
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(`  [FAIL] ${property.name}: ${error}`);
      return false;
    }

    console.log(`  [OK] ${property.name}`);
    return true;
  } catch (error) {
    console.error(`  [ERROR] ${property.name}: ${error}`);
    return false;
  }
}

async function main(): Promise<void> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('Error: HUBSPOT_ACCESS_TOKEN environment variable required');
    console.log('\nUsage: HUBSPOT_ACCESS_TOKEN=xxx npx ts-node scripts/setup-hubspot-properties.ts');
    process.exit(1);
  }

  console.log('=== HubSpot Properties Setup ===\n');
  console.log(`Total properties to create: ${PROPERTIES.length}\n`);

  // Create property group first
  const groupCreated = await createPropertyGroup(accessToken);
  if (!groupCreated) {
    console.error('\nFailed to create property group. Aborting.');
    process.exit(1);
  }

  console.log('\nCreating properties...\n');

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const property of PROPERTIES) {
    const success = await createProperty(property, accessToken);
    if (success) {
      created++;
    } else {
      failed++;
    }

    // Rate limiting - small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n=== Summary ===');
  console.log(`Total: ${PROPERTIES.length}`);
  console.log(`Created/Existing: ${created}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log('\nHubSpot properties setup complete!');
  } else {
    console.log('\nSome properties failed to create. Check errors above.');
    process.exit(1);
  }
}

main().catch(console.error);
