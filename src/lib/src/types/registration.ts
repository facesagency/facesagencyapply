export interface RegistrationFormData {
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
