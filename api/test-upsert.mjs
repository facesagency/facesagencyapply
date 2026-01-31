// Test upsert functionality - send same email twice
const PROD_URL = 'https://facesagencyapply-5be5a5e3-main.vercel.app';

const testEmail = 'upsert-test-' + Date.now() + '@facesagency.com';

const initialData = {
  email: testEmail,
  firstName: 'Initial',
  lastName: 'User',
  mobile: '+961 70 111222',
  governorate: 'Beirut',
  district: 'Beirut District',
  area: 'Hamra'
};

const updatedData = {
  email: testEmail,  // Same email
  firstName: 'Updated',  // Changed name
  lastName: 'UserModified',  // Changed last name
  mobile: '+961 70 111222',
  whatsapp: '+961 70 333444',  // Added whatsapp
  instagram: '@updateduser',  // Added instagram
  governorate: 'Beirut',
  district: 'Beirut District',
  area: 'Achrafieh'  // Changed area
};

console.log('Testing UPSERT functionality...\n');

try {
  // First request - should CREATE
  console.log('=== FIRST REQUEST (CREATE) ===');
  console.log('Data:', JSON.stringify(initialData, null, 2));

  const response1 = await fetch(PROD_URL + '/api/hubspot-upsert-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(initialData)
  });

  const result1 = await response1.json();
  console.log('Status:', response1.status);
  console.log('Action:', result1.action);
  console.log('Contact ID:', result1.data?.id);

  if (result1.action === 'created') {
    console.log('✅ Contact created successfully!\n');
  } else {
    console.log('❌ Expected "created" but got:', result1.action, '\n');
  }

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Second request with same email - should UPDATE
  console.log('=== SECOND REQUEST (UPDATE) ===');
  console.log('Data:', JSON.stringify(updatedData, null, 2));

  const response2 = await fetch(PROD_URL + '/api/hubspot-upsert-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });

  const result2 = await response2.json();
  console.log('Status:', response2.status);
  console.log('Action:', result2.action);
  console.log('Contact ID:', result2.data?.id || 'N/A');

  if (result2.action === 'updated') {
    console.log('✅ Contact updated successfully!');
    console.log('\n📊 UPSERT TEST PASSED! Both create and update work correctly.');
  } else {
    console.log('❌ Expected "updated" but got:', result2.action);
  }

  console.log('\n🔗 View in HubSpot:', `https://app-eu1.hubspot.com/contacts/147343267/record/0-1/${result1.data?.id}`);

} catch (error) {
  console.error('\n❌ ERROR:', error.message);
}
