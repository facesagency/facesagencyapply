# HubSpot Contact Properties Schema

This document defines all custom HubSpot contact properties required for the Faces Agency registration system.

## Property Naming Convention

- All custom properties use the prefix `faces_`
- Snake_case naming (e.g., `faces_first_name`)
- Group: `faces_agency` (create this custom property group in HubSpot)

---

## Personal Information

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_gender` | Gender | enumeration | select | Yes | `male`, `female` |
| `faces_first_name` | First Name | string | text | Yes | Max 50 chars |
| `faces_middle_name` | Middle Name | string | text | Yes | Max 50 chars |
| `faces_last_name` | Last Name | string | text | Yes | Max 50 chars |
| `faces_date_of_birth` | Date of Birth | date | date | Yes | YYYY-MM-DD |
| `faces_nationality` | Nationality | string | text | Yes | |

---

## Contact Information

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_mobile` | Mobile Number | string | text | Yes | Full number with country code |
| `faces_whatsapp` | WhatsApp Number | string | text | Yes | Full number with country code |
| `faces_other_number` | Emergency Contact Number | string | text | No | Full number with country code |
| `faces_other_number_relationship` | Emergency Contact Relationship | enumeration | select | No | `Mother`, `Father`, `Brother`, `Sister`, `Uncle`, `Aunt`, `Cousin`, `Grandfather`, `Grandmother`, `Spouse`, `Friend`, `Colleague`, `Other` |
| `faces_other_number_person_name` | Emergency Contact Name | string | text | No | |
| `faces_instagram` | Instagram Username | string | text | No | |
| `faces_has_whish_account` | Has WHISH Account | enumeration | select | No | `yes`, `no` |
| `faces_whish_number` | WHISH Number | string | text | No | |

---

## Location

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_governorate` | Governorate | string | text | Yes | Lebanese governorate |
| `faces_district` | District | string | text | Yes | |
| `faces_area` | Area | string | text | Yes | |

---

## Languages

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_languages` | Languages | string | textarea | Yes | JSON array: `["Arabic", "English"]` |
| `faces_language_levels` | Language Proficiency Levels | string | textarea | No | JSON object: `{"Arabic": 5, "English": 4}` (1-5 scale) |

---

## Appearance

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_eye_color` | Eye Color | string | text | Yes | |
| `faces_hair_color` | Hair Color | string | text | Yes | |
| `faces_hair_type` | Hair Type | enumeration | select | Yes | `Straight`, `Wavy`, `Curly`, `Coily` |
| `faces_hair_length` | Hair Length | enumeration | select | Yes | `Bald`, `Buzz Cut`, `Short`, `Medium`, `Long`, `Very Long` |
| `faces_skin_tone` | Skin Tone | string | text | Yes | |
| `faces_has_tattoos` | Has Tattoos | enumeration | booleancheckbox | No | `true`, `false` |
| `faces_has_piercings` | Has Piercings | enumeration | booleancheckbox | No | `true`, `false` |

---

## Measurements

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_height_cm` | Height (cm) | number | number | Yes | |
| `faces_weight_kg` | Weight (kg) | number | number | Yes | |
| `faces_pant_size` | Pant Size | string | text | Yes | |
| `faces_jacket_size` | Jacket Size | string | text | Yes | |
| `faces_shoe_size` | Shoe Size | string | text | Yes | |
| `faces_bust_cm` | Bust (cm) | number | number | No | |
| `faces_waist_cm` | Waist (cm) | number | number | No | |
| `faces_hips_cm` | Hips (cm) | number | number | No | |
| `faces_shoulders_cm` | Shoulders (cm) | number | number | No | |

---

## Talents & Skills

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_talents` | Talents | string | textarea | No | JSON array |
| `faces_talent_levels` | Talent Proficiency Levels | string | textarea | No | JSON object (1-5 scale) |
| `faces_sports` | Sports | string | textarea | No | JSON array |
| `faces_sport_levels` | Sport Proficiency Levels | string | textarea | No | JSON object (1-5 scale) |
| `faces_modeling_types` | Modeling Types | string | textarea | No | JSON array |
| `faces_has_modeling_experience` | Has Modeling Experience | enumeration | select | No | `yes`, `no` |
| `faces_comfortable_with_swimwear` | Comfortable with Swimwear | enumeration | select | No | `true`, `false`, `null` |
| `faces_interested_in_extra_work` | Interested in Extra Work | enumeration | select | No | `yes`, `no` |

---

## Availability & Travel

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_has_car` | Has Car | enumeration | select | No | `yes`, `no` |
| `faces_has_driving_license` | Has Driving License | enumeration | select | No | `yes`, `no` |
| `faces_willing_to_travel` | Willing to Travel | enumeration | select | No | `yes`, `no` |
| `faces_has_valid_passport` | Has Valid Passport | enumeration | select | No | `yes`, `no` |
| `faces_has_multiple_passports` | Has Multiple Passports | enumeration | select | No | `yes`, `no` |
| `faces_passport_countries` | Passport Countries | string | textarea | No | JSON array |
| `faces_has_look_alike_twin` | Has Look-Alike Twin | enumeration | select | No | `yes`, `no` |

---

## System Fields

| Property Name | Label | Type | Field Type | Required | Options/Notes |
|---------------|-------|------|------------|----------|---------------|
| `faces_application_date` | Application Date | datetime | date | Auto | When form was submitted |
| `faces_application_source` | Application Source | enumeration | select | Auto | `website`, `excel_import`, `manual` |
| `faces_supabase_id` | Supabase Record ID | string | text | Auto | Links to Supabase applications table |

---

## HubSpot Setup Instructions

### 1. Create Property Group

In HubSpot Settings > Properties > Contact Properties:
- Click "Create a group"
- Name: `Faces Agency`
- Internal name: `faces_agency`

### 2. Create Properties

For each property above:
1. Click "Create property"
2. Select group: `Faces Agency`
3. Enter the label and internal name exactly as specified
4. Select the correct field type
5. For enumeration types, add all options listed

### 3. API Configuration

Required for website sync:
- HubSpot Private App with scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`
- Store the access token as environment variable: `HUBSPOT_ACCESS_TOKEN`

---

## Data Type Notes

### JSON Fields
The following fields store JSON data as strings in HubSpot:
- `faces_languages` - Array of language names
- `faces_language_levels` - Object mapping language to proficiency (1-5)
- `faces_talents` - Array of talent names
- `faces_talent_levels` - Object mapping talent to proficiency (1-5)
- `faces_sports` - Array of sport names
- `faces_sport_levels` - Object mapping sport to proficiency (1-5)
- `faces_modeling_types` - Array of modeling types
- `faces_passport_countries` - Array of country names

### Phone Number Format
All phone fields should include country code:
- Format: `+XXX XXXXXXXXX` (e.g., `+961 71234567`)

### Proficiency Scale
- 1 = Basic/Beginner
- 2 = Elementary
- 3 = Intermediate
- 4 = Advanced
- 5 = Fluent/Expert
