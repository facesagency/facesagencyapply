import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const REFERRAL_SOURCES = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Friend or Family",
  "Google Search",
  "Event or Casting Call",
  "Other"
];

interface ReviewStepProps {
  formData: {
    gender: "male" | "female";
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    mobile: string;
    mobileCountryCode: string;
    whatsapp: string;
    whatsappCountryCode: string;
    otherNumber: string;
    otherNumberCountryCode: string;
    instagram: string;
    governorate: string;
    district: string;
    area: string;
    languages: string[];
    languageLevels?: Record<string, number>;
    height: string;
    weight: string;
    bust: string;
    waist: string;
    hips: string;
    eyeColor: string;
    hairColor: string;
    skinTone: string;
    hasTattoos: boolean;
    hasPiercings: boolean;
    talents: string[];
    sports: string[];
    experience: string;
    interestedInExtra: string;
    hasCar: string;
    hasLicense: string;
    isEmployed: string;
    canTravel: string;
    hasPassport: string;
    hasMultiplePassports: string;
    passports?: string[];
    howDidYouHear: string;
    howDidYouHearOther: string;
  };
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
  isSubmitting: boolean;
}

const ReviewStep = ({ formData, onSubmit, onChange, isSubmitting }: ReviewStepProps) => {

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return "Basic";
      case 2: return "Elementary";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Fluent";
      default: return "";
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="text-primary font-semibold text-sm uppercase tracking-wider">
        {title}
      </h3>
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | boolean }) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "-"}
      </span>
    </div>
  );

  const formatLanguagesWithLevels = () => {
    if (!formData.languages || formData.languages.length === 0) return "-";
    return formData.languages.map(lang => {
      const level = formData.languageLevels?.[lang];
      return level ? `${lang} (${getLevelText(level)})` : lang;
    }).join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Review Your Information
        </h2>
        <p className="text-muted-foreground">
          Please verify all details before submitting
        </p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        <Section title="Personal Information">
          <Field label="First Name" value={formData.firstName} />
          <Field label="Middle Name" value={formData.middleName} />
          <Field label="Last Name" value={formData.lastName} />
          <Field label="Gender" value={formData.gender === "male" ? "Male" : "Female"} />
          <Field label="Date of Birth" value={formData.dateOfBirth} />
          <Field label="Nationality" value={formData.nationality} />
        </Section>

        <Section title="Contact">
          <Field label="Mobile" value={`${formData.mobileCountryCode} ${formData.mobile}`} />
          <Field label="WhatsApp" value={`${formData.whatsappCountryCode} ${formData.whatsapp}`} />
          <Field label="Other Number" value={`${formData.otherNumberCountryCode} ${formData.otherNumber}`} />
        </Section>

        <Section title="Social Media">
          <Field label="Instagram" value={formData.instagram ? `@${formData.instagram}` : "-"} />
        </Section>

        <Section title="Location">
          <Field label="Governorate" value={formData.governorate} />
          <Field label="District" value={formData.district} />
          <Field label="Area" value={formData.area} />
        </Section>

        <Section title="Languages">
          <div className="text-sm">
            <span className="text-muted-foreground">Languages:</span>
            <p className="text-foreground mt-1">{formatLanguagesWithLevels()}</p>
          </div>
        </Section>

        <Section title="Physical Features">
          <Field label="Height" value={formData.height ? `${formData.height} cm` : "-"} />
          <Field label="Weight" value={formData.weight ? `${formData.weight} kg` : "-"} />
          <Field label="Measurements" value={formData.bust && formData.waist && formData.hips ? `${formData.bust}-${formData.waist}-${formData.hips}` : "-"} />
          <Field label="Eye Color" value={formData.eyeColor} />
          <Field label="Hair Color" value={formData.hairColor} />
          <Field label="Skin Tone" value={formData.skinTone} />
          <Field label="Tattoos" value={formData.hasTattoos} />
          <Field label="Piercings" value={formData.hasPiercings} />
        </Section>

        <Section title="Talents & Experience">
          <Field label="Talents" value={formData.talents?.join(", ") || "-"} />
          <Field label="Sports" value={formData.sports?.join(", ") || "-"} />
          {formData.experience && (
            <div className="text-sm">
              <span className="text-muted-foreground">Experience:</span>
              <p className="text-foreground mt-1">{formData.experience}</p>
            </div>
          )}
        </Section>

        <Section title="Availability & Logistics">
          <Field label="Experience" value={formData.experience === "yes" ? "Yes" : formData.experience === "no" ? "No" : "-"} />
          <Field label="Interested in Extra Work" value={formData.interestedInExtra === "yes" ? "Yes" : formData.interestedInExtra === "no" ? "No" : "-"} />
          <Field label="Has Car" value={formData.hasCar === "yes" ? "Yes" : formData.hasCar === "no" ? "No" : "-"} />
          <Field label="Driving License" value={formData.hasLicense === "yes" ? "Yes" : formData.hasLicense === "no" ? "No" : "-"} />
          <Field label="Employed" value={formData.isEmployed === "yes" ? "Yes" : formData.isEmployed === "no" ? "No" : "-"} />
          <Field label="Willing to Travel" value={formData.canTravel === "yes" ? "Yes" : formData.canTravel === "no" ? "No" : "-"} />
          <Field label="Valid Passport" value={formData.hasPassport === "yes" ? "Yes" : formData.hasPassport === "no" ? "No" : "-"} />
          <Field label="Multiple Passports" value={formData.hasMultiplePassports === "yes" ? "Yes" : formData.hasMultiplePassports === "no" ? "No" : "-"} />
          {formData.hasMultiplePassports === "yes" && formData.passports && formData.passports.length > 0 && (
            <Field label="Passports" value={formData.passports.join(", ")} />
          )}
        </Section>

      </div>

      {/* How Did You Hear About Us */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="space-y-2">
          <Label htmlFor="howDidYouHear" className="text-sm font-medium">
            How did you hear about us? *
          </Label>
          <Select
            value={formData.howDidYouHear}
            onValueChange={(value) => onChange("howDidYouHear", value)}
          >
            <SelectTrigger className="h-12 md:h-14">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {REFERRAL_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.howDidYouHear === "Other" && (
          <div className="space-y-2">
            <Label htmlFor="howDidYouHearOther" className="text-sm font-medium">
              Please specify *
            </Label>
            <Input
              id="howDidYouHearOther"
              placeholder="Tell us how you heard about us"
              value={formData.howDidYouHearOther}
              onChange={(e) => onChange("howDidYouHearOther", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
        )}
      </div>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full h-14 text-lg font-semibold"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Check className="w-5 h-5 mr-2" />
            Submit Application
          </>
        )}
      </Button>
    </div>
  );
};

export default ReviewStep;