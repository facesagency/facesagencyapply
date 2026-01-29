import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCodes } from "@/data/lebanese-locations";

const otherNumberRelationships = [
  "Mother",
  "Father",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Cousin",
  "Grandfather",
  "Grandmother",
  "Spouse",
  "Friend",
  "Colleague",
  "Other"
];

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
    hasWhishAccount: string;
    whishNumber: string;
    whishCountryCode: string;
  };
  onChange: (field: string, value: string) => void;
  className?: string;
}
const ContactStep = ({
  data,
  onChange,
  className
}: ContactStepProps) => {
  return <div className={`space-y-6 ${className || ''}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans text-center">
          Contact Information
        </h2>
        <p className="text-muted-foreground">How can we reach you?</p>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            placeholder="your@email.com" 
            value={data.email} 
            onChange={e => onChange("email", e.target.value)} 
            className="h-12 md:h-14" 
            type="email" 
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
          <Label htmlFor="whatsapp">WhatsApp Number *</Label>
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
          <Label htmlFor="otherNumber">Emergency Contact *</Label>
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
          <Label htmlFor="otherNumberRelationship">Who is this contact? *</Label>
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
          <Label htmlFor="otherNumberPersonName">Contact name *</Label>
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
      <div className="pt-6 border-t border-border mt-[100px] my-[110px]">
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

      {/* Payment Method Section */}
      <div className="pt-6 border-t border-border">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans text-center">
            Payment Method
          </h2>
          <p className="text-muted-foreground">How would you like to receive payments?</p>
        </div>
        
        <div className="space-y-4 md:space-y-5">
          <div className="space-y-3">
            <Label>Do you have a current active WHISH account?</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => onChange("hasWhishAccount", "yes")}
                className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  data.hasWhishAccount === "yes"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className={`text-lg font-semibold ${
                  data.hasWhishAccount === "yes" ? "text-primary" : "text-foreground"
                }`}>
                  Yes
                </span>
              </div>
              <div
                onClick={() => onChange("hasWhishAccount", "no")}
                className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  data.hasWhishAccount === "no"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className={`text-lg font-semibold ${
                  data.hasWhishAccount === "no" ? "text-primary" : "text-foreground"
                }`}>
                  No
                </span>
              </div>
            </div>
          </div>

          {data.hasWhishAccount === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="whishNumber">WHISH Number *</Label>
              <div className="flex gap-2 md:gap-3">
                <Input 
                  id="whishCountryCode" 
                  placeholder="+961" 
                  value={data.whishCountryCode || "+961"} 
                  onChange={e => onChange("whishCountryCode", e.target.value)} 
                  className="w-24 md:w-28 h-12 md:h-14 text-center" 
                  type="tel" 
                />
                <Input id="whishNumber" placeholder="XX XXX XXX" value={data.whishNumber || ""} onChange={e => onChange("whishNumber", e.target.value)} className="h-12 md:h-14 flex-1" type="tel" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default ContactStep;