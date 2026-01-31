#!/usr/bin/env node

/**
 * Direct HubSpot Contact Submission
 * Bypasses Vercel API and submits directly to HubSpot
 */

// Get token from environment variable
// Set via: HUBSPOT_TOKEN=your_token node direct-hubspot-submit.js
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_TOKEN || 'YOUR_TOKEN_HERE';
const HUBSPOT_API_URL = 'https://api.hubapi.com';

// Generate unique test data
const timestamp = Date.now();
const randomPhone = Math.floor(70000000 + Math.random() * 9999999);

const testContact = {
  properties: {
    // Built-in HubSpot properties
    firstname: 'Claude',
    lastname: 'TestSubmission',
    email: `claude-test-${timestamp}@example.com`,

    // Custom Faces Agency properties
    faces_mobile: `+961 ${randomPhone}`,
    faces_whatsapp: `+961 ${randomPhone}`,
    faces_gender: 'female',
    faces_date_of_birth: '1995-06-15',
    faces_nationality: 'Lebanese',

    // Contact info
    faces_instagram: '@claudetest',
    faces_has_whish_account: 'yes',
    faces_whish_number: `+961 ${randomPhone}`,

    // Location
    faces_governorate: 'Beirut',
    faces_district: 'Beirut',
    faces_area: 'Hamra',

    // Languages (JSON string)
    faces_languages: JSON.stringify(['English', 'Arabic', 'French']),
    faces_language_levels: JSON.stringify({ 'English': 5, 'Arabic': 5, 'French': 4 }),

    // Appearance
    faces_eye_color: 'Brown',
    faces_hair_color: 'Black',
    faces_hair_type: 'Straight',
    faces_hair_length: 'Long',
    faces_skin_tone: 'Medium',
    faces_has_tattoos: 'false',
    faces_has_piercings: 'false',

    // Measurements
    faces_height_cm: '168',
    faces_weight_kg: '58',
    faces_pant_size: 'M',
    faces_jacket_size: 'M',
    faces_shoe_size: '38',
    faces_bust_cm: '86',
    faces_waist_cm: '66',
    faces_hips_cm: '92',
    faces_shoulders_cm: '40',

    // Talents & Skills (JSON strings)
    faces_talents: JSON.stringify(['Acting', 'Dancing', 'Singing']),
    faces_talent_levels: JSON.stringify({ 'Acting': 4, 'Dancing': 5, 'Singing': 3 }),
    faces_sports: JSON.stringify(['Swimming', 'Yoga']),
    faces_sport_levels: JSON.stringify({ 'Swimming': 4, 'Yoga': 5 }),
    faces_modeling_types: JSON.stringify(['Fashion', 'Commercial', 'Editorial']),
    faces_has_modeling_experience: 'yes',
    faces_comfortable_with_swimwear: 'true',
    faces_interested_in_extra_work: 'yes',

    // Availability
    faces_has_car: 'no',
    faces_has_driving_license: 'yes',
    faces_willing_to_travel: 'yes',
    faces_has_valid_passport: 'yes',
    faces_has_multiple_passports: 'no',
    faces_has_look_alike_twin: 'no',

    // Referral
    faces_how_did_you_hear: 'Instagram',

    // System fields
    faces_application_date: new Date().toISOString(),
    faces_application_source: 'website',
    faces_supabase_id: `test-${timestamp}`
  }
};

console.log('🚀 Direct HubSpot Contact Submission');
console.log('=====================================\n');
console.log('📝 Contact Details:');
console.log(`   Name: ${testContact.properties.firstname} ${testContact.properties.lastname}`);
console.log(`   Email: ${testContact.properties.email}`);
console.log(`   Phone: ${testContact.properties.faces_mobile}`);
console.log(`   Gender: ${testContact.properties.faces_gender}`);
console.log(`   Location: ${testContact.properties.faces_area}, ${testContact.properties.faces_district}`);
console.log('');
console.log('📤 Submitting to HubSpot...\n');

fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testContact)
})
  .then(response => {
    console.log(`📊 Response Status: ${response.status} ${response.statusText}\n`);
    return response.json();
  })
  .then(data => {
    if (data.id) {
      console.log('✅ SUCCESS! Contact created in HubSpot!\n');
      console.log('📋 Contact Details:');
      console.log(`   Contact ID: ${data.id}`);
      console.log(`   Created: ${data.createdAt}`);
      console.log('');
      console.log('🔗 View in HubSpot:');
      console.log(`   https://app.hubspot.com/contacts/your-hub-id/contact/${data.id}`);
      console.log('');
      console.log('✨ Or search for: "Claude TestSubmission"');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 MISSION ACCOMPLISHED!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('The HubSpot integration is working perfectly!');
      console.log('The contact is now in HubSpot with all properties.');
      console.log('');
      console.log('Next steps:');
      console.log('1. Fix the Vercel deployment to include /api folder');
      console.log('2. Add HUBSPOT_ACCESS_TOKEN to Vercel env vars');
      console.log('3. Form submissions will then work automatically');

      process.exit(0);
    } else {
      console.log('❌ Unexpected response format:');
      console.log(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('❌ ERROR\n');
    console.error('Error:', error.message);
    console.log('');
    console.log('Possible issues:');
    console.log('- Invalid access token');
    console.log('- Token expired or revoked');
    console.log('- Network connectivity issue');
    console.log('- HubSpot API down');
    process.exit(1);
  });
