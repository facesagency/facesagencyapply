import { z } from "zod";

// Phone number validation - allows digits, spaces, dashes
const phoneRegex = /^[\d\s\-()]+$/;

// Names: any Unicode letters (Latin, Arabic, Armenian, ...), spaces, hyphens, apostrophes
const nameRegex = /^[\p{L}\s\-']+$/u;

const nameField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(50, `${label} must be less than 50 characters`)
    .regex(nameRegex, `${label} can only contain letters, spaces, hyphens, and apostrophes`);

export const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return null;
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const mainInfoSchema = z
  .object({
    gender: z.string().min(1, "Please select your gender"),
    firstName: nameField("First name"),
    middleName: nameField("Middle name"),
    lastName: nameField("Last name"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string().min(1, "Nationality is required"),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.dateOfBirth);
    if (age === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dateOfBirth"], message: "Please enter a valid date of birth" });
      return;
    }
    if (age < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dateOfBirth"], message: "Date of birth cannot be in the future" });
    }
    if (age > 100) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dateOfBirth"], message: "Please check the date of birth" });
    }
  });

export const contactSchema = z
  .object({
    email: z.string().refine(
      (val) => val === "" || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
      { message: "Please enter a valid email address" }
    ),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .max(20, "Mobile number is too long")
      .regex(phoneRegex, "Invalid phone number format"),
    whatsapp: z
      .string()
      .min(1, "WhatsApp number is required")
      .max(20, "WhatsApp number is too long")
      .regex(phoneRegex, "Invalid phone number format"),
    // Emergency contact: required for minors, optional for adults (enforced below)
    otherNumber: z
      .string()
      .max(20, "Emergency number is too long")
      .refine((val) => val === "" || phoneRegex.test(val), { message: "Invalid emergency number format" }),
    otherNumberRelationship: z.string(),
    otherNumberPersonName: z.string().max(80, "Contact name is too long"),
    instagram: z.string().optional(),
    // Used only to decide whether the emergency contact is mandatory
    dateOfBirth: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.dateOfBirth || "");
    const isMinor = age !== null && age < 18;
    if (isMinor) {
      if (!data.otherNumber) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherNumber"], message: "A parent/guardian contact number is required for applicants under 18" });
      }
      if (!data.otherNumberRelationship) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherNumberRelationship"], message: "Please select the parent/guardian relationship" });
      }
      if (!data.otherNumberPersonName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherNumberPersonName"], message: "Please enter the parent/guardian name" });
      }
    } else {
      // For adults, if a number is given, relationship and name must accompany it
      if (data.otherNumber && !data.otherNumberRelationship) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["otherNumberRelationship"], message: "Please select who this contact is" });
      }
    }
  });

export const addressSchema = z.object({
  governorate: z.string().min(1, "Governorate is required"),
  district: z.string().min(1, "District is required"),
  area: z.string().min(1, "Area is required"),
});

export const languagesSchema = z.object({
  languages: z.array(z.string()).min(1, "Please select at least one language"),
});

export const appearanceSchema = z.object({
  eyeColor: z.string().min(1, "Eye color is required"),
  hairColor: z.string().min(1, "Hair color is required"),
  hairType: z.string().min(1, "Hair type is required"),
  hairLength: z.string().min(1, "Hair length is required"),
  skinTone: z.string().min(1, "Skin tone is required"),
});

export const measurementsSchema = z
  .object({
    height: z.string().min(1, "Height is required"),
    weight: z.string().min(1, "Weight is required"),
    pantSize: z.string().min(1, "Pant size is required"),
    jacketSize: z.string().min(1, "Jacket size is required"),
    shoeSize: z.string().min(1, "Shoe size is required"),
    waist: z.string().optional(),
    bust: z.string().optional(),
    hips: z.string().optional(),
    shoulders: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const h = Number(data.height);
    if (isNaN(h) || h < 40 || h > 230) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["height"], message: "Height must be between 40 and 230 cm" });
    }
    const w = Number(data.weight);
    if (isNaN(w) || w < 3 || w > 200) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["weight"], message: "Weight must be between 3 and 200 kg" });
    }
  });

export type MainInfoData = z.infer<typeof mainInfoSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type LanguagesData = z.infer<typeof languagesSchema>;
export type AppearanceData = z.infer<typeof appearanceSchema>;
export type MeasurementsData = z.infer<typeof measurementsSchema>;
