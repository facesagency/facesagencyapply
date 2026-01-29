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
  heightUnit?: string;
  weight: string;
  weightUnit?: string;
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
  interestedInExtra: string;
  hasCar: string;
  hasLicense: string;
  isEmployed: string;
  canTravel: string;
  hasPassport: string;
  hasMultiplePassports: string;
  passports: string[];
  comfortableWithSwimwear: boolean | null;
}

export async function submitApplication(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("Starting application submission for:", formData.email);

  try {
    // Call HubSpot API via Vercel serverless function
    const response = await fetch('/api/hubspot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        mobile: `${formData.mobileCountryCode} ${formData.mobile}`.trim(),
        whatsapp: `${formData.whatsappCountryCode} ${formData.whatsapp}`.trim(),
        otherNumber: formData.otherNumber ? `${formData.otherNumberCountryCode} ${formData.otherNumber}`.trim() : null,
        instagram: formData.instagram || null,
        governorate: formData.governorate,
        district: formData.district,
        area: formData.area,
        languages: formData.languages,
        languageLevels: formData.languageLevels,
        eyeColor: formData.customEyeColor || formData.eyeColor,
        hairColor: formData.customHairColor || formData.hairColor,
        hairType: formData.hairType,
        hairLength: formData.hairLength,
        skinTone: formData.skinTone,
        height: formData.height,
        weight: formData.weight,
        pantSize: formData.pantSize,
        jacketSize: formData.jacketSize,
        shoeSize: formData.shoeSize,
        waist: formData.waist || null,
        bust: formData.bust || null,
        hips: formData.hips || null,
        shoulders: formData.shoulders || null,
        talents: formData.talents,
        talentLevels: formData.talentLevels,
        sports: formData.sports,
        sportLevels: formData.sportLevels,
        experience: formData.experience || null,
        hasPassport: formData.hasPassport === "yes",
        canTravel: formData.canTravel === "yes",
        hasCar: formData.hasCar,
        hasTattoos: formData.hasTattoos,
        hasPiercings: formData.hasPiercings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("HubSpot API call failed:", errorData);
      return {
        success: false,
        error: errorData.error || "Failed to submit application to HubSpot"
      };
    }

    const data = await response.json();
    console.log("HubSpot submission successful:", data);

    return { success: true };
  } catch (err) {
    console.error("Unexpected submission error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred"
    };
  }
}
