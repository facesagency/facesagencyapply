require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Faces Agency API Server' });
});

// HubSpot contact creation endpoint
app.post('/api/hubspot', async (req, res) => {
  try {
    const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN is not configured');
      return res.status(500).json({ error: 'HubSpot API is not properly configured' });
    }

    const formData = req.body;

    // Build HubSpot contact properties
    const properties = {
      email: formData.email,
      firstname: formData.firstName,
      lastname: formData.lastName,
      phone: formData.mobile,
      mobilephone: formData.mobile,
    };

    // Add optional fields
    if (formData.middleName) properties.middlename = formData.middleName;
    if (formData.dateOfBirth) properties.date_of_birth = formData.dateOfBirth;
    if (formData.nationality) properties.nationality = formData.nationality;
    if (formData.whatsapp) properties.whatsapp = formData.whatsapp;
    if (formData.instagram) properties.instagram = formData.instagram;
    if (formData.governorate) properties.governorate = formData.governorate;
    if (formData.district) properties.district = formData.district;
    if (formData.area) properties.area = formData.area;
    if (formData.height) properties.height = formData.height;
    if (formData.weight) properties.weight = formData.weight;
    if (formData.eyeColor) properties.eye_color = formData.eyeColor;
    if (formData.hairColor) properties.hair_color = formData.hairColor;
    if (formData.hairType) properties.hair_type = formData.hairType;
    if (formData.skinTone) properties.skin_tone = formData.skinTone;
    if (formData.languages) properties.languages = JSON.stringify(formData.languages);
    if (formData.talents) properties.talents = JSON.stringify(formData.talents);
    if (formData.sports) properties.sports = JSON.stringify(formData.sports);
    if (formData.experience) properties.experience = formData.experience;
    if (formData.hasCar) properties.has_car = formData.hasCar;
    if (formData.hasPassport !== undefined) properties.has_passport = String(formData.hasPassport);
    if (formData.canTravel !== undefined) properties.willing_to_travel = String(formData.canTravel);

    console.log('Creating/updating HubSpot contact:', formData.email);

    // Try to create contact
    const hubspotResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      }
    );

    // If contact already exists (409), update it instead
    if (hubspotResponse.status === 409) {
      console.log('Contact exists, updating...');

      // Search for contact by email
      const searchResponse = await fetch(
        'https://api.hubapi.com/crm/v3/objects/contacts/search',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hubspotAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: formData.email
              }]
            }]
          }),
        }
      );

      const searchData = await searchResponse.json();

      if (searchData.results && searchData.results.length > 0) {
        const contactId = searchData.results[0].id;

        // Update existing contact
        const updateResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${hubspotAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ properties }),
          }
        );

        if (!updateResponse.ok) {
          const updateError = await updateResponse.text();
          throw new Error(`Failed to update contact: ${updateError}`);
        }

        const updatedContact = await updateResponse.json();
        console.log('Contact updated successfully:', contactId);

        return res.status(200).json({
          success: true,
          action: 'updated',
          contactId: updatedContact.id
        });
      }
    }

    // Handle other errors
    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API error:', errorText);
      throw new Error(`HubSpot API error: ${errorText}`);
    }

    // Successfully created new contact
    const responseData = await hubspotResponse.json();
    console.log('Contact created successfully:', responseData.id);

    return res.status(200).json({
      success: true,
      action: 'created',
      contactId: responseData.id
    });

  } catch (error) {
    console.error('Error in HubSpot API handler:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`HubSpot endpoint: http://localhost:${PORT}/api/hubspot`);
});
