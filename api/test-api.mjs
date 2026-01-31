// Test HubSpot API directly
const HUBSPOT_API_KEY = 'pat-eu1-ad5001af-b4d4-482a-8938-8a7a5f4b69b2';

const testData = {
  properties: {
    email: 'claude-api-test-' + Date.now() + '@facesagency.com',
    firstname: 'Claude',
    lastname: 'APITest',
    phone: '+961 70 999888',
    faces_whatsapp: '+961 70 999888',
    faces_instagram: '@claudeapitest',
    faces_governorate: 'Beirut',
    faces_district: 'Beirut District',
    faces_area: 'Hamra'
  }
};

console.log('Testing HubSpot API...');
console.log('Contact data:', JSON.stringify(testData, null, 2));

try {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HUBSPOT_API_KEY}`
    },
    body: JSON.stringify(testData)
  });

  console.log('\n=== RESPONSE ===');
  console.log('Status:', response.status, response.statusText);

  const responseData = await response.json();
  console.log('Response:', JSON.stringify(responseData, null, 2));

  if (response.ok) {
    console.log('\n✅ SUCCESS! Contact created with ID:', responseData.id);
  } else {
    console.log('\n❌ FAILED!');
  }
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
}
