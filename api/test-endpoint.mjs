// Test hubspot-upsert-contact endpoint
const PROD_URL = 'https://facesagencyapply-5be5a5e3-main.vercel.app';

const testData = {
  email: 'endpoint-test-' + Date.now() + '@facesagency.com',
  firstName: 'Endpoint',
  lastName: 'Test',
  mobile: '+961 70 888999',
  whatsapp: '+961 70 888999',
  instagram: '@endpointtest',
  governorate: 'Beirut',
  district: 'Beirut District',
  area: 'Achrafieh',
  gender: 'female',
  dateOfBirth: '1998-08-20',
  nationality: 'Lebanese',
  heightCm: 165,
  weightKg: 55,
  pantSize: '28',
  jacketSize: 'S',
  shoeSize: '38',
  eyeColor: 'Green',
  hairColor: 'Brown',
  hairType: 'Wavy',
  hairLength: 'Long',
  skinTone: 'Fair',
  hasTattoos: 'false',
  hasPiercings: 'true',
  cameraConfidence: 4,  // NEW: Camera confidence rating 1-5
  applicationDate: new Date().toISOString(),
  applicationSource: 'website-test'
};

console.log('Testing hubspot-upsert-contact endpoint...');
console.log('URL:', PROD_URL + '/api/hubspot-upsert-contact');
console.log('Contact data:', JSON.stringify(testData, null, 2));

try {
  const response = await fetch(PROD_URL + '/api/hubspot-upsert-contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
  });

  console.log('\n=== RESPONSE ===');
  console.log('Status:', response.status, response.statusText);

  const responseData = await response.json();
  console.log('Response:', JSON.stringify(responseData, null, 2));

  if (response.ok) {
    console.log('\n✅ SUCCESS! Endpoint is working!');
    if (responseData.action === 'created') {
      console.log('Contact created with ID:', responseData.data?.id);
      console.log('View in HubSpot:', `https://app-eu1.hubspot.com/contacts/147343267/record/0-1/${responseData.data?.id}`);
    } else if (responseData.action === 'updated') {
      console.log('Contact updated');
    }
  } else {
    console.log('\n❌ FAILED!');
  }
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
}
