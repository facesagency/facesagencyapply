// Test script for hubspot-upsert-contact endpoint
const handler = require('./hubspot-upsert-contact.ts').default;

// Mock Vercel request and response
const mockReq = {
  method: 'POST',
  body: {
    email: 'claude-test@facesagency.com',
    firstName: 'Claude',
    lastName: 'TestUser',
    mobile: '+961 70 999888',
    whatsapp: '+961 70 999888',
    instagram: '@claudetest',
    governorate: 'Beirut',
    district: 'Beirut District',
    area: 'Hamra',
    gender: 'male',
    dateOfBirth: '1995-05-15',
    nationality: 'Lebanese',
    heightCm: 180,
    weightKg: 75,
    pantSize: '32',
    jacketSize: 'M',
    shoeSize: '42',
    eyeColor: 'Brown',
    hairColor: 'Black',
    hairType: 'Straight',
    hairLength: 'Short',
    skinTone: 'Medium',
    hasTattoos: 'false',
    hasPiercings: 'false',
    applicationDate: new Date().toISOString(),
    applicationSource: 'website'
  }
};

const mockRes = {
  statusCode: 200,
  headers: {},
  setHeader: function(key, value) {
    this.headers[key] = value;
    return this;
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('\n=== RESPONSE ===');
    console.log('Status:', this.statusCode);
    console.log('Headers:', JSON.stringify(this.headers, null, 2));
    console.log('Body:', JSON.stringify(data, null, 2));
    return this;
  },
  end: function() {
    console.log('\n=== END ===');
    return this;
  }
};

// Set environment variable
process.env.HUBSPOT_ACCESS_TOKEN = 'pat-eu1-741e9cfb-a2a4-4efd-9fac-b2971fad7a6a';

console.log('=== TESTING HUBSPOT UPSERT CONTACT ===\n');
console.log('Request:', JSON.stringify(mockReq.body, null, 2));

// Call the handler
handler(mockReq, mockRes).catch(err => {
  console.error('\n=== ERROR ===');
  console.error(err);
});
