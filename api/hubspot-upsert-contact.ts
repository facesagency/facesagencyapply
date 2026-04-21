import type { VercelRequest, VercelResponse } from '@vercel/node';

const HUBSPOT_API_KEY = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_PRIVATE_APP_TOKEN || process.env.HUBSPOT_API_KEY;

interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  whatsapp?: string;
  instagram?: string;
  governorate?: string;
  district?: string;
  area?: string;
  talentId?: string;

  // Personal Information
  gender?: string;
  middleName?: string;
  dateOfBirth?: string;
  nationality?: string;

  // Contact Information
  otherNumber?: string;
  otherNumberRelationship?: string;
  otherNumberPersonName?: string;
  hasWhishAccount?: string;
  whishNumber?: string;

  // Languages
  languages?: string;
  languageLevels?: string;

  // Appearance
  eyeColor?: string;
  hairColor?: string;
  hairType?: string;
  hairLength?: string;
  skinTone?: string;
  hasTattoos?: string;
  hasPiercings?: string;

  // Measurements
  heightCm?: number;
  weightKg?: number;
  pantSize?: string;
  jacketSize?: string;
  shoeSize?: string;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  shouldersCm?: number;

  // Talents & Skills
  talents?: string;
  talentLevels?: string;
  sports?: string;
  sportLevels?: string;
  modelingTypes?: string;
  hasModelingExperience?: string;
  comfortableWithSwimwear?: string;
  interestedInExtraWork?: string;
  cameraConfidence?: number;

  // Availability & Travel
  hasCar?: string;
  hasDrivingLicense?: string;
  willingToTravel?: string;
  hasValidPassport?: string;
  hasMultiplePassports?: string;
  passportCountries?: string;
  hasLookAlikeTwin?: string;

  // System Fields
  applicationDate?: string;
  applicationSource?: string;
  supabaseId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('HubSpot API Function Called');

    if (!HUBSPOT_API_KEY) {
      console.error('HUBSPOT_API_KEY is not set');
      return res.status(500).json({ error: 'HubSpot API key not configured' });
    }

    const contactData: ContactData = req.body;
    console.log('Received contact data:', { email: contactData.email });

// Prepare HubSpot contact properties
    const properties: Record<string, string> = {
      email: contactData.email,
    };

    if (contactData.firstName) properties.firstname = contactData.firstName;
    if (contactData.lastName) properties.lastname = contactData.lastName;
    if (contactData.mobile) properties.phone = contactData.mobile;
    if (contactData.whatsapp) properties.faces_whatsapp = contactData.whatsapp;
    if (contactData.instagram) properties.faces_instagram = contactData.instagram;
    if (contactData.governorate) properties.faces_governorate = contactData.governorate;
    if (contactData.district) properties.faces_district = contactData.district;
    if (contactData.area) properties.faces_area = contactData.area;
    if (contactData.cameraConfidence) properties.faces_camera_confidence = String(contactData.cameraConfidence);
    if (contactData.talentId) properties.talent_id = contactData.talentId;

    console.log('Upserting contact to HubSpot:', contactData.email);
    // Create or update contact in HubSpot
    const hubspotResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify({
          properties,
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API Error:', errorText);

      // If contact already exists (409), try to update instead
      if (hubspotResponse.status === 409) {
        console.log('Contact exists, searching for contact ID...');

        // Search for contact by email
        const searchResponse = await fetch(
          'https://api.hubapi.com/crm/v3/objects/contacts/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            },
            body: JSON.stringify({
              filterGroups: [
                {
                  filters: [
                    {
                      propertyName: 'email',
                      operator: 'EQ',
                      value: contactData.email,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.results && searchData.results.length > 0) {
            const contactId = searchData.results[0].id;
            console.log('Found contact ID:', contactId, '- updating...');

            // Update the existing contact
            const updateResponse = await fetch(
              `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                },
                body: JSON.stringify({
                  properties,
                }),
              }
            );

            if (updateResponse.ok) {
              const updateData = await updateResponse.json();
              console.log('Contact updated successfully');
              return res.status(200).json({
                success: true,
                action: 'updated',
                data: updateData,
              });
            } else {
              const updateError = await updateResponse.text();
              console.error('Update failed:', updateError);
              throw new Error(`Failed to update contact: ${updateError}`);
            }
          }
        }
      }

      throw new Error(`HubSpot API error: ${errorText}`);
    }

    const data = await hubspotResponse.json();
    console.log('Contact created successfully');

    return res.status(200).json({
      success: true,
      action: 'created',
      data,
    });
  } catch (error) {
    console.error('Error in HubSpot function:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
