import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN is not configured');
      return res.status(500).json({
        error: 'HubSpot API is not properly configured'
      });
    }

    const formData = req.body;

    // Build HubSpot contact properties
    const properties: Record<string, string> = {
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

    // Create or update contact in HubSpot
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

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API Error:', errorText);

      // If contact already exists, try to update instead
      if (hubspotResponse.status === 409) {
        console.log('Contact exists, attempting to update...');

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

        if (!searchResponse.ok) {
          throw new Error('Failed to search for existing contact');
        }

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
          return res.status(200).json({
            success: true,
            action: 'updated',
            contactId: updatedContact.id
          });
        }
      }

      throw new Error(`HubSpot API error: ${errorText}`);
    }

    const responseData = await hubspotResponse.json();

    return res.status(200).json({
      success: true,
      action: 'created',
      contactId: responseData.id
    });

  } catch (error) {
    console.error('Error in HubSpot API handler:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
