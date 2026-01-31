import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nationalities, countryCodes } from "@/data/lebanese-locations";

interface MainInfoStepProps {
  data: {
    gender: "male" | "female";
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
  };
  onChange: (field: string, value: string) => void;
}

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const MainInfoStep = ({ data, onChange }: MainInfoStepProps) => {
  const age = calculateAge(data.dateOfBirth);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Tell us about yourself
        </h2>
        <p className="text-muted-foreground">Basic information to get started</p>
      </div>

      <div className="space-y-4">
        {/* Gender Selection */}
        <div className="space-y-2">
          <Label>I am a... *</Label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onChange("gender", "female")}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                data.gender === "female"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary hover:bg-primary/5 text-foreground"
              }`}
            >
              <span className="text-lg font-semibold">Female</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("gender", "male")}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                data.gender === "male"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary hover:bg-primary/5 text-foreground"
              }`}
            >
              <span className="text-lg font-semibold">Male</span>
            </button>
          </div>
        </div>

        {/* Name Fields */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name *</Label>
          <Input
            id="middleName"
            placeholder="Enter your middle name"
            value={data.middleName}
            onChange={(e) => onChange("middleName", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="h-12"
          />
        </div>

        {/* Date of Birth with Age */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <div className="flex items-center gap-3">
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className="h-12 flex-1"
            />
            {age !== null && (
              <div className="flex items-center justify-center px-4 h-12 bg-secondary rounded-md text-sm font-medium whitespace-nowrap">
                {age} years old
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Select
            value={data.nationality}
            onValueChange={(value) => onChange("nationality", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
};

export default MainInfoStep;
