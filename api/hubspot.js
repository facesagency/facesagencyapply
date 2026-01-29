export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN is not configured');
      return res.status(500).json({ error: 'HubSpot API is not properly configured' });
    }

    const formData = req.body;
    const properties = {
      email: formData.email,
      firstname: formData.firstName,
      lastname: formData.lastName,
      phone: formData.mobile,
      mobilephone: formData.mobile,
    };

    if (formData.middleName) properties.middlename = formData.middleName;
    if (formData.whatsapp) properties.whatsapp = formData.whatsapp;
    if (formData.instagram) properties.instagram = formData.instagram;
    if (formData.governorate) properties.governorate = formData.governorate;

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
      
      if (hubspotResponse.status === 409) {
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

          const updatedContact = await updateResponse.json();
          return res.status(200).json({ success: true, action: 'updated', contactId: updatedContact.id });
        }
      }

      throw new Error(`HubSpot API error: ${errorText}`);
    }

    const responseData = await hubspotResponse.json();
    return res.status(200).json({ success: true, action: 'created', contactId: responseData.id });

  } catch (error) {
    console.error('Error in HubSpot API handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
