/**
 * Test script to submit sample data to the deployed form
 * This simulates what the frontend sends to the API
 */

// Sample test data matching the form structure
const testFormData = {
  gender: "female",
  firstName: "Sarah",
  middleName: "Marie",
  lastName: "TestUser",
  dateOfBirth: "1998-05-15",
  nationality: "Lebanese",
  email: "test.submission." + Date.now() + "@example.com",
  mobile: "71234567",
  mobileCountryCode: "+961",
  whatsapp: "71234567",
  whatsappCountryCode: "+961",
  otherNumber: "70987654",
  otherNumberCountryCode: "+961",
  otherNumberRelationship: "Mother",
  otherNumberPersonName: "Diana TestUser",
  instagram: "@sarahtest",
  hasWhishAccount: "yes",
  whishNumber: "71234567",
  whishCountryCode: "+961",
  governorate: "Beirut",
  district: "Beirut",
  area: "Hamra",
  languages: ["Arabic", "English", "French"],
  languageLevels: { "Arabic": 5, "English": 5, "French": 4 },
  customLanguage: "",
  height: "170",
  weight: "58",
  pantSize: "S",
  jacketSize: "M",
  shoeSize: "38",
  bust: "86",
  waist: "65",
  hips: "92",
  shoulders: "38",
  eyeColor: "Brown",
  hairColor: "Brown",
  hairType: "Straight",
  hairLength: "Long",
  skinTone: "Medium",
  hasTattoos: false,
  hasPiercings: true,
  customEyeColor: "",
  customHairColor: "",
  talents: ["Acting", "Dancing"],
  talentLevels: { "Acting": 4, "Dancing": 5 },
  sports: ["Swimming"],
  sportLevels: { "Swimming": 4 },
  modeling: ["Fashion", "Commercial"],
  customTalent: "",
  customSport: "",
  customModeling: "",
  experience: "2 years of experience in commercial modeling",
  interestedInExtra: "yes",
  hasCar: "no",
  hasLicense: "yes",
  isEmployed: "no",
  canTravel: "yes",
  hasPassport: "yes",
  hasMultiplePassports: "no",
  passports: ["Lebanese"],
  comfortableWithSwimwear: true,
  cameraConfidence: 8,
  hasLookAlikeTwin: "no",
  howDidYouHear: "Instagram",
  howDidYouHearOther: ""
};

console.log('Testing form submission with data:');
console.log('Email:', testFormData.email);
console.log('Name:', testFormData.firstName, testFormData.middleName, testFormData.lastName);
console.log('Gender:', testFormData.gender);
console.log('\n--- Submitting to deployed API ---\n');

// Import the transformation function from the source code
// This simulates what the frontend does
async function testSubmission() {
  try {
    // Transform data to HubSpot properties (matching src/lib/hubspot.ts logic)
    const properties = {
      // HubSpot built-in properties
      email: testFormData.email,
      firstname: testFormData.firstName,
      lastname: testFormData.lastName,
      phone: `${testFormData.mobileCountryCode} ${testFormData.mobile}`,

      // Personal Info
      faces_gender: testFormData.gender,
      faces_middle_name: testFormData.middleName,
      faces_date_of_birth: testFormData.dateOfBirth,
      faces_nationality: testFormData.nationality,

      // Contact Info
      faces_mobile: `${testFormData.mobileCountryCode} ${testFormData.mobile}`,
      faces_whatsapp: `${testFormData.whatsappCountryCode} ${testFormData.whatsapp}`,
      faces_other_number: `${testFormData.otherNumberCountryCode} ${testFormData.otherNumber}`,
      faces_other_number_relationship: testFormData.otherNumberRelationship,
      faces_other_number_person_name: testFormData.otherNumberPersonName,
      faces_instagram: testFormData.instagram,

      // Location
      faces_governorate: testFormData.governorate,
      faces_district: testFormData.district,
      faces_area: testFormData.area,

      // Languages
      faces_languages: JSON.stringify(testFormData.languages),
      faces_language_levels: JSON.stringify(testFormData.languageLevels),

      // Appearance
      faces_eye_color: testFormData.eyeColor,
      faces_hair_color: testFormData.hairColor,
      faces_hair_type: testFormData.hairType,
      faces_hair_length: testFormData.hairLength,
      faces_skin_tone: testFormData.skinTone,
      faces_has_tattoos: String(testFormData.hasTattoos),
      faces_has_piercings: String(testFormData.hasPiercings),

      // Measurements
      faces_height_cm: testFormData.height,
      faces_weight_kg: testFormData.weight,
      faces_pant_size: testFormData.pantSize,
      faces_jacket_size: testFormData.jacketSize,
      faces_shoe_size: testFormData.shoeSize,
      faces_bust_cm: testFormData.bust,
      faces_waist_cm: testFormData.waist,
      faces_hips_cm: testFormData.hips,
      faces_shoulders_cm: testFormData.shoulders,

      // Talents
      faces_talents: JSON.stringify(testFormData.talents),
      faces_talent_levels: JSON.stringify(testFormData.talentLevels),
      faces_sports: JSON.stringify(testFormData.sports),
      faces_sport_levels: JSON.stringify(testFormData.sportLevels),
      faces_modeling_types: JSON.stringify(testFormData.modeling),
      faces_has_modeling_experience: testFormData.experience ? 'yes' : 'no',
      faces_modeling_experience_details: testFormData.experience,
      faces_comfortable_with_swimwear: String(testFormData.comfortableWithSwimwear),
      faces_interested_in_extra_work: testFormData.interestedInExtra,
      faces_camera_confidence: String(testFormData.cameraConfidence),

      // Availability
      faces_has_car: testFormData.hasCar,
      faces_has_driving_license: testFormData.hasLicense,
      faces_willing_to_travel: testFormData.canTravel,
      faces_has_valid_passport: testFormData.hasPassport,
      faces_has_multiple_passports: testFormData.hasMultiplePassports,
      faces_passport_countries: JSON.stringify(testFormData.passports),
      faces_has_look_alike_twin: testFormData.hasLookAlikeTwin,

      // Referral
      faces_how_did_you_hear: testFormData.howDidYouHear,

      // System
      faces_application_date: new Date().toISOString(),
      faces_application_source: 'website'
    };

    console.log('Transformed properties count:', Object.keys(properties).length);
    console.log('Property keys:', Object.keys(properties).join(', '));
    console.log('\n--- Sending to API ---\n');

    const response = await fetch('https://facesagencyapply-5be5a5e3-main.vercel.app/api/hubspot-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        properties
      })
    });

    const result = await response.json();

    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✓ SUCCESS! Contact created with ID:', result.contactId);
      console.log('\nNow check the Vercel logs to see what properties were sent!');
      console.log('Go to: https://vercel.com/facesagency → Functions → /api/hubspot-submit');
    } else {
      console.log('\n✗ FAILED:', result.error);
    }

  } catch (error) {
    console.error('Error during test:', error);
  }
}

testSubmission();
