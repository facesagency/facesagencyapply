import { z } from "zod";

// Phone number validation - allows digits, spaces, dashes
const phoneRegex = /^[\d\s\-()]+$/;

export const mainInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  middleName: z
    .string()
    .min(1, "Middle name is required")
    .max(50, "Middle name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Middle name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

export const contactSchema = z.object({
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
  otherNumber: z
    .string()
    .min(1, "Other number is required")
    .max(20, "Other number is too long")
    .regex(phoneRegex, "Invalid phone number format"),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
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

export const measurementsSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  pantSize: z.string().min(1, "Pant size is required"),
  jacketSize: z.string().min(1, "Jacket/Blouse size is required"),
  shoeSize: z.string().min(1, "Shoe size is required"),
  waist: z.string().optional(),
  bust: z.string().optional(),
  hips: z.string().optional(),
  shoulders: z.string().optional(),
});

export type MainInfoData = z.infer<typeof mainInfoSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type LanguagesData = z.infer<typeof languagesSchema>;
export type AppearanceData = z.infer<typeof appearanceSchema>;
export type MeasurementsData = z.infer<typeof measurementsSchema>;
