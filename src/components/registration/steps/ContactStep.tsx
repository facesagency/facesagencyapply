import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from "@/data/lebanese-locations";
import InfoNote from "../InfoNote";

const otherNumberRelationships = [
  "Mother",
  "Father",
  "Guardian",
  "Husband",
  "Wife",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Cousin",
  "Grandfather",
  "Grandmother",
  "Friend",
  "Colleague",
  "Other"
];

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

interface ContactStepProps {
  data: {
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
    dateOfBirth: string;
  };
  onChange: (field: string, value: string) => void;
  className?: string;
}

const ContactStep = ({ data, onChange, className }: ContactStepProps) => {
  const age = calculateAge(data.dateOfBirth);
  const isMinor = age !== null && age < 18;
  const sameAsMobile = data.whatsapp !== "" && data.whatsapp === data.mobile && data.whatsappCountryCode === data.mobileCountryCode;

  const handleSameAsMobile = (checked: boolean) => {
    if (checked) {
      onChange("whatsapp", data.mobile);
      onChange("whatsappCountryCode", data.mobileCountryCode);
    } else {
      onChange("whatsapp", "");
    }
  };

  return <div className={`space-y-6 ${className || ''}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans text-center">
          Contact Information
        </h2>
        <p className="text-muted-foreground">How can we reach you?</p>
      </div>

      {isMinor && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-foreground">
          👨‍👩‍👧 A parent or guardian should complete this application together with the child.
        </div>
      )}

      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address (optional)"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-12 md:h-14"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <div className="flex gap-2 md:gap-3">
            <Select value={data.mobileCountryCode || "+961"} onValueChange={value => onChange("mobileCountryCode", value)}>
              <SelectTrigger className="w-28 md:w-32 h-12 md:h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map(code => <SelectItem key={code.code} value={code.code}>
                    {code.code}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Input id="mobile" placeholder="XX XXX XXX" value={data.mobile} onChange={e => onChange("mobile", e.target.value)} className="h-12 md:h-14 flex-1" type="tel" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp">WhatsApp Number *</Label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox
                checked={sameAsMobile}
                onCheckedChange={(checked) => handleSameAsMobile(checked === true)}
              />
              Same as mobile
            </label>
          </div>
          <div className="flex gap-2 md:gap-3">
            <Select value={data.whatsappCountryCode || "+961"} onValueChange={value => onChange("whatsappCountryCode", value)}>
              <SelectTrigger className="w-28 md:w-32 h-12 md:h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map(code => <SelectItem key={code.code} value={code.code}>
                    {code.code}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Input id="whatsapp" placeholder="XX XXX XXX" value={data.whatsapp} onChange={e => onChange("whatsapp", e.target.value)} className="h-12 md:h-14 flex-1" type="tel" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherNumber">
            {isMinor ? "Parent/Guardian Contact *" : "Emergency Contact"}
            {isMinor && <InfoNote text="For applicants under 18 a parent or guardian contact is required." />}
          </Label>
          <div className="flex gap-2 md:gap-3">
            <Select value={data.otherNumberCountryCode || "+961"} onValueChange={value => onChange("otherNumberCountryCode", value)}>
              <SelectTrigger className="w-28 md:w-32 h-12 md:h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map(code => <SelectItem key={code.code} value={code.code}>
                    {code.code}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Input id="otherNumber" placeholder="XX XXX XXX" value={data.otherNumber} onChange={e => onChange("otherNumber", e.target.value)} className="h-12 md:h-14 flex-1" type="tel" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherNumberRelationship">{isMinor ? "Who is this contact? *" : "Who is this contact?"}</Label>
          <Select value={data.otherNumberRelationship} onValueChange={value => onChange("otherNumberRelationship", value)}>
            <SelectTrigger className="h-12 md:h-14">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {otherNumberRelationships.map(rel => (
                <SelectItem key={rel} value={rel.toLowerCase()}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherNumberPersonName">{isMinor ? "Contact name *" : "Contact name"}</Label>
          <Input
            id="otherNumberPersonName"
            placeholder="Enter name"
            value={data.otherNumberPersonName}
            onChange={e => onChange("otherNumberPersonName", e.target.value)}
            className="h-12 md:h-14"
          />
        </div>
      </div>

      {/* Social Media Section */}
      <div className="pt-6 border-t border-border">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans text-center">
            Social Media
          </h2>
          <p className="text-muted-foreground">Share your online presence</p>
        </div>

        <div className="space-y-4 md:space-y-5">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input id="instagram" placeholder="username" value={data.instagram} onChange={e => onChange("instagram", e.target.value)} className="h-12 md:h-14 pl-8" />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ContactStep;
