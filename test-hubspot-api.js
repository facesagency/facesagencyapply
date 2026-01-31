#!/usr/bin/env node

/**
 * Direct API Test Script for HubSpot Integration
 *
 * Usage:
 *   node test-hubspot-api.js https://your-site.vercel.app
 *
 * This script directly tests the /api/hubspot-submit endpoint
 */

const url = process.argv[2];

if (!url) {
  console.error('❌ Please provide your Vercel URL as an argument');
  console.error('Usage: node test-hubspot-api.js https://your-site.vercel.app');
  process.exit(1);
}

const apiUrl = url.endsWith('/') ? `${url}api/hubspot-submit` : `${url}/api/hubspot-submit`;

console.log('🧪 Testing HubSpot API Integration');
console.log('📍 URL:', apiUrl);
console.log('');

const testData = {
  action: 'create',
  properties: {
    firstname: 'APITest',
    lastname: 'Script',
    email: `test${Date.now()}@example.com`,
    faces_mobile: `+961 ${Math.floor(10000000 + Math.random() * 89999999)}`,
    faces_gender: 'male',
    faces_application_date: new Date().toISOString(),
    faces_application_source: 'api_test_script'
  }
};

console.log('📤 Sending test contact:');
console.log(JSON.stringify(testData.properties, null, 2));
console.log('');

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
  .then(response => {
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    return response.json();
  })
  .then(data => {
    console.log('');
    console.log('📨 Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    if (data.success) {
      console.log('✅ SUCCESS!');
      console.log(`🎉 Contact created with ID: ${data.contactId}`);
      console.log('');
      console.log('👉 Now check HubSpot:');
      console.log('   1. Go to https://app.hubspot.com');
      console.log('   2. Navigate to Contacts → Contacts');
      console.log('   3. Search for "APITest Script"');
      console.log('   4. Verify the contact appears with all properties');
    } else {
      console.log('❌ FAILED');
      console.log(`Error: ${data.error}`);
      if (data.details) {
        console.log('Details:', JSON.stringify(data.details, null, 2));
      }
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('   - Check that HUBSPOT_ACCESS_TOKEN is set in Vercel');
      console.log('   - Verify the token has correct scopes');
      console.log('   - Check Vercel function logs for more details');
    }
  })
  .catch(error => {
    console.log('');
    console.log('❌ REQUEST FAILED');
    console.error('Error:', error.message);
    console.log('');
    console.log('🔧 Possible issues:');
    console.log('   - URL is incorrect');
    console.log('   - API endpoint not deployed');
    console.log('   - Network/CORS issues');
  });
