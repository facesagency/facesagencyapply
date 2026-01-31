/**
 * Excel to HubSpot Import Script
 *
 * This script:
 * 1. Reads an Excel file with historical customer data
 * 2. Cleans and standardizes the data
 * 3. Maps columns to HubSpot contact properties
 * 4. Imports contacts to HubSpot via batch API
 *
 * Usage:
 *   npx ts-node scripts/excel-to-hubspot.ts --file=data.xlsx --dry-run
 *   npx ts-node scripts/excel-to-hubspot.ts --file=data.xlsx --import
 *
 * Requirements:
 *   npm install xlsx dotenv
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const HUBSPOT_API_URL = 'https://api.hubapi.com';
const BATCH_SIZE = 100;

interface ExcelRow {
  [key: string]: string | number | undefined;
}

interface HubSpotContact {
  properties: Record<string, string>;
}

interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  created: number;
  errors: string[];
}

/**
 * Column mapping from Excel headers to HubSpot property names
 * Customize this based on your Excel file structure
 */
const COLUMN_MAPPING: Record<string, string> = {
  // Personal Info
  'First Name': 'faces_first_name',
  'Middle Name': 'faces_middle_name',
  'Last Name': 'faces_last_name',
  'Gender': 'faces_gender',
  'Date of Birth': 'faces_date_of_birth',
  'DOB': 'faces_date_of_birth',
  'Nationality': 'faces_nationality',

  // Contact
  'Mobile': 'faces_mobile',
  'Phone': 'faces_mobile',
  'WhatsApp': 'faces_whatsapp',
  'Instagram': 'faces_instagram',

  // Location
  'Governorate': 'faces_governorate',
  'District': 'faces_district',
  'Area': 'faces_area',
  'City': 'faces_area',

  // Appearance
  'Eye Color': 'faces_eye_color',
  'Hair Color': 'faces_hair_color',
  'Hair Type': 'faces_hair_type',
  'Hair Length': 'faces_hair_length',
  'Skin Tone': 'faces_skin_tone',

  // Measurements
  'Height': 'faces_height_cm',
  'Height (cm)': 'faces_height_cm',
  'Weight': 'faces_weight_kg',
  'Weight (kg)': 'faces_weight_kg',
  'Pant Size': 'faces_pant_size',
  'Jacket Size': 'faces_jacket_size',
  'Shoe Size': 'faces_shoe_size',
  'Bust': 'faces_bust_cm',
  'Waist': 'faces_waist_cm',
  'Hips': 'faces_hips_cm',

  // Skills
  'Languages': 'faces_languages',
  'Talents': 'faces_talents',
  'Sports': 'faces_sports',
  'Experience': 'faces_has_modeling_experience',

  // Availability
  'Has Car': 'faces_has_car',
  'Has License': 'faces_has_driving_license',
  'Can Travel': 'faces_willing_to_travel',
  'Has Passport': 'faces_has_valid_passport',

  // Email (standard HubSpot property)
  'Email': 'email',
};

/**
 * Clean and standardize phone numbers
 */
function cleanPhoneNumber(phone: string | number | undefined): string {
  if (!phone) return '';

  let cleaned = String(phone).replace(/[^\d+]/g, '');

  // Add Lebanon country code if not present
  if (cleaned && !cleaned.startsWith('+')) {
    if (cleaned.startsWith('961')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+961' + cleaned.substring(1);
    } else if (cleaned.length <= 8) {
      cleaned = '+961' + cleaned;
    }
  }

  // Format: +XXX XXXXXXXX
  if (cleaned.startsWith('+961') && cleaned.length > 4) {
    return cleaned.substring(0, 4) + ' ' + cleaned.substring(4);
  }

  return cleaned;
}

/**
 * Clean and standardize dates to YYYY-MM-DD
 */
function cleanDate(date: string | number | undefined): string {
  if (!date) return '';

  // Handle Excel serial date numbers
  if (typeof date === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + date * 86400000);
    return jsDate.toISOString().split('T')[0];
  }

  const dateStr = String(date);

  // Try various date formats
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, // D/M/YY
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (format === formats[0]) return dateStr; // Already correct format

      let year = match[3];
      let month = match[2];
      let day = match[1];

      // Handle 2-digit year
      if (year.length === 2) {
        year = parseInt(year) > 50 ? '19' + year : '20' + year;
      }

      // Swap day/month if format is MM/DD/YYYY
      if (parseInt(month) > 12 && parseInt(day) <= 12) {
        [day, month] = [month, day];
      }

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  return '';
}

/**
 * Clean and standardize gender values
 */
function cleanGender(gender: string | undefined): string {
  if (!gender) return '';

  const normalized = String(gender).toLowerCase().trim();

  if (['male', 'm', 'man', 'boy'].includes(normalized)) return 'male';
  if (['female', 'f', 'woman', 'girl'].includes(normalized)) return 'female';

  return '';
}

/**
 * Clean array fields (languages, talents, etc.)
 */
function cleanArrayField(value: string | undefined): string {
  if (!value) return '';

  // If it's already JSON, validate it
  if (value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return value;
    } catch {
      // Not valid JSON, continue processing
    }
  }

  // Split by common delimiters and create JSON array
  const items = String(value)
    .split(/[,;|]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);

  return items.length > 0 ? JSON.stringify(items) : '';
}

/**
 * Clean yes/no fields
 */
function cleanYesNo(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return '';

  const normalized = String(value).toLowerCase().trim();

  if (['yes', 'y', 'true', '1', 'oui'].includes(normalized)) return 'yes';
  if (['no', 'n', 'false', '0', 'non'].includes(normalized)) return 'no';

  return '';
}

/**
 * Transform and clean a single row from Excel
 */
function transformRow(row: ExcelRow, rowIndex: number): { contact: HubSpotContact | null; errors: string[] } {
  const errors: string[] = [];
  const properties: Record<string, string> = {};

  // Map columns to HubSpot properties
  for (const [excelHeader, hubspotProp] of Object.entries(COLUMN_MAPPING)) {
    const value = row[excelHeader];
    if (value === undefined || value === null || value === '') continue;

    let cleanedValue: string;

    // Apply specific cleaning based on property type
    switch (hubspotProp) {
      case 'faces_mobile':
      case 'faces_whatsapp':
        cleanedValue = cleanPhoneNumber(value);
        break;

      case 'faces_date_of_birth':
        cleanedValue = cleanDate(value);
        break;

      case 'faces_gender':
        cleanedValue = cleanGender(String(value));
        break;

      case 'faces_languages':
      case 'faces_talents':
      case 'faces_sports':
        cleanedValue = cleanArrayField(String(value));
        break;

      case 'faces_has_car':
      case 'faces_has_driving_license':
      case 'faces_willing_to_travel':
      case 'faces_has_valid_passport':
      case 'faces_has_modeling_experience':
        cleanedValue = cleanYesNo(value);
        break;

      case 'faces_height_cm':
      case 'faces_weight_kg':
      case 'faces_bust_cm':
      case 'faces_waist_cm':
      case 'faces_hips_cm':
        cleanedValue = String(value).replace(/[^\d.]/g, '');
        break;

      default:
        cleanedValue = String(value).trim();
    }

    if (cleanedValue) {
      properties[hubspotProp] = cleanedValue;
    }
  }

  // Validation - require at least name and phone
  if (!properties.faces_first_name && !properties.faces_last_name) {
    errors.push(`Row ${rowIndex + 2}: Missing name`);
    return { contact: null, errors };
  }

  if (!properties.faces_mobile && !properties.faces_whatsapp) {
    errors.push(`Row ${rowIndex + 2}: Missing phone number`);
    return { contact: null, errors };
  }

  // Add system fields
  properties.faces_application_source = 'excel_import';
  properties.faces_application_date = new Date().toISOString();

  return { contact: { properties }, errors };
}

/**
 * Read and parse Excel file
 */
function readExcelFile(filePath: string): ExcelRow[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet);
}

/**
 * Deduplicate contacts by phone number
 */
function deduplicateContacts(contacts: HubSpotContact[]): { unique: HubSpotContact[]; duplicateCount: number } {
  const seen = new Set<string>();
  const unique: HubSpotContact[] = [];
  let duplicateCount = 0;

  for (const contact of contacts) {
    const phone = contact.properties.faces_mobile || contact.properties.faces_whatsapp || '';
    const key = phone.replace(/\s/g, '');

    if (key && seen.has(key)) {
      duplicateCount++;
      continue;
    }

    if (key) seen.add(key);
    unique.push(contact);
  }

  return { unique, duplicateCount };
}

/**
 * Import contacts to HubSpot via batch API
 */
async function importToHubSpot(
  contacts: HubSpotContact[],
  accessToken: string
): Promise<{ created: number; errors: string[] }> {
  const results = { created: 0, errors: [] as string[] };

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);

    console.log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} contacts)...`);

    try {
      const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/batch/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: batch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        results.errors.push(`Batch ${batchNum}: ${errorData}`);
      } else {
        const data = await response.json();
        results.created += data.results?.length || 0;
      }
    } catch (error) {
      results.errors.push(`Batch ${batchNum}: ${String(error)}`);
    }

    // Rate limiting - wait 100ms between batches
    if (i + BATCH_SIZE < contacts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Generate a cleaned Excel file for review
 */
function generateCleanedExcel(contacts: HubSpotContact[], outputPath: string): void {
  const rows = contacts.map(c => c.properties);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cleaned Data');
  XLSX.writeFile(workbook, outputPath);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  const fileArg = args.find(a => a.startsWith('--file='));
  const dryRun = args.includes('--dry-run');
  const doImport = args.includes('--import');

  if (!fileArg) {
    console.log(`
Excel to HubSpot Import Script
==============================

Usage:
  npx ts-node scripts/excel-to-hubspot.ts --file=data.xlsx --dry-run
  npx ts-node scripts/excel-to-hubspot.ts --file=data.xlsx --import

Options:
  --file=PATH     Path to Excel file (required)
  --dry-run       Validate and clean data without importing
  --import        Actually import to HubSpot

Environment:
  HUBSPOT_ACCESS_TOKEN    HubSpot Private App access token
    `);
    process.exit(1);
  }

  const filePath = fileArg.split('=')[1];
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (doImport && !accessToken) {
    console.error('Error: HUBSPOT_ACCESS_TOKEN environment variable required for import');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`\nReading file: ${filePath}\n`);

  // Read Excel file
  const rows = readExcelFile(filePath);
  console.log(`Found ${rows.length} rows in Excel file`);

  // Transform and validate each row
  const allErrors: string[] = [];
  const validContacts: HubSpotContact[] = [];

  for (let i = 0; i < rows.length; i++) {
    const { contact, errors } = transformRow(rows[i], i);
    allErrors.push(...errors);
    if (contact) {
      validContacts.push(contact);
    }
  }

  // Deduplicate
  const { unique, duplicateCount } = deduplicateContacts(validContacts);

  // Report
  console.log(`\n=== Import Summary ===`);
  console.log(`Total rows:     ${rows.length}`);
  console.log(`Valid contacts: ${validContacts.length}`);
  console.log(`Invalid rows:   ${rows.length - validContacts.length}`);
  console.log(`Duplicates:     ${duplicateCount}`);
  console.log(`Ready to import: ${unique.length}`);

  if (allErrors.length > 0) {
    console.log(`\n=== Validation Errors ===`);
    allErrors.slice(0, 20).forEach(e => console.log(`  ${e}`));
    if (allErrors.length > 20) {
      console.log(`  ... and ${allErrors.length - 20} more errors`);
    }
  }

  // Generate cleaned file
  const cleanedPath = filePath.replace(/\.xlsx?$/i, '_cleaned.xlsx');
  generateCleanedExcel(unique, cleanedPath);
  console.log(`\nCleaned data exported to: ${cleanedPath}`);

  // Import if requested
  if (doImport && accessToken) {
    console.log(`\n=== Starting HubSpot Import ===`);
    const importResult = await importToHubSpot(unique, accessToken);
    console.log(`\nImport complete!`);
    console.log(`Created: ${importResult.created} contacts`);
    if (importResult.errors.length > 0) {
      console.log(`Errors: ${importResult.errors.length}`);
      importResult.errors.forEach(e => console.log(`  ${e}`));
    }
  } else if (!dryRun && !doImport) {
    console.log(`\nUse --import to actually import to HubSpot, or --dry-run to just validate`);
  }
}

main().catch(console.error);
