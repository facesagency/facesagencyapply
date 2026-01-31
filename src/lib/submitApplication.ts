import { syncToHubSpot } from "./hubspot";

interface FormData {
  gender: "male" | "female";
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  mobile: string;
  mobileCountryCode: string;
  whatsapp: string;
  whatsappCountryCode: string;
  otherNumber: string;
  otherNumberCountryCode: string;
  otherNumberRelationship: string;
  otherNumberPersonName: string;
  instagram: string;
  hasWhishAccount: string;
  whishNumber: string;
  whishCountryCode: string;
  governorate: string;
  district: string;
  area: string;
  languages: string[];
  languageLevels: Record<string, number>;
  customLanguage: string;
  height: string;
  weight: string;
  pantSize: string;
  jacketSize: string;
  shoeSize: string;
  bust: string;
  waist: string;
  hips: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  hairLength: string;
  skinTone: string;
  hasTattoos: boolean;
  hasPiercings: boolean;
  customEyeColor: string;
  customHairColor: string;
  shoulders: string;
  talents: string[];
  talentLevels: Record<string, number>;
  sports: string[];
  sportLevels: Record<string, number>;
  modeling: string[];
  customTalent: string;
  customSport: string;
  customModeling: string;
  experience: string;
  cameraConfidence: number;
  interestedInExtra: string;
  hasCar: string;
  hasLicense: string;
  isEmployed: string;
  canTravel: string;
  hasPassport: string;
  hasMultiplePassports: string;
  passports: string[];
  comfortableWithSwimwear: boolean | null;
  hasLookAlikeTwin: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
}

export async function submitApplication(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("[submitApplication] ========== Starting ==========");
  console.log("[submitApplication] Received formData:", JSON.stringify(formData, null, 2));

  try {
    // Send directly to HubSpot (single source of truth)
    console.log("[submitApplication] Calling syncToHubSpot...");
    const hubspotResult = await syncToHubSpot(formData);
    console.log("[submitApplication] syncToHubSpot returned:", JSON.stringify(hubspotResult));

    if (!hubspotResult.success) {
      console.error("[submitApplication] HubSpot sync failed:", hubspotResult.error);
      // Return the actual error message so user can see what's wrong
      return { success: false, error: hubspotResult.error || "Failed to submit application. Please try again." };
    }

    console.log("[submitApplication] Success! Contact ID:", hubspotResult.contactId);
    return { success: true };
  } catch (err) {
    console.error("[submitApplication] ========== UNEXPECTED ERROR ==========");
    console.error("[submitApplication] Error:", err);
    console.error("[submitApplication] Error type:", typeof err);
    console.error("[submitApplication] Error message:", err instanceof Error ? err.message : String(err));
    // Return the actual error message
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Submission error: ${errorMessage}` };
  }
}
