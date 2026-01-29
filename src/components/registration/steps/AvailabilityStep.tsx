import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { nationalities } from "@/data/lebanese-locations";

interface AvailabilityStepProps {
  data: {
    interestedInExtra: string;
    hasCar: string;
    hasLicense: string;
    isEmployed: string;
    canTravel: string;
    hasPassport: string;
    hasMultiplePassports: string;
    passports: string[];
    hasLookAlikeTwin: string;
  };
  onChange: (field: string, value: string | boolean | string[]) => void;
}

const AvailabilityStep = ({ data, onChange }: AvailabilityStepProps) => {
  const PollQuestion = ({
    label,
    field,
    value,
  }: {
    label: string;
    field: string;
    value: string;
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => onChange(field, "yes")}
          className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
            value === "yes"
              ? "border-primary bg-primary/10 shadow-md"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <span className={`text-lg font-semibold ${
            value === "yes" ? "text-primary" : "text-foreground"
          }`}>
            Yes
          </span>
        </div>
        <div
          onClick={() => onChange(field, "no")}
          className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
            value === "no"
              ? "border-primary bg-primary/10 shadow-md"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <span className={`text-lg font-semibold ${
            value === "no" ? "text-primary" : "text-foreground"
          }`}>
            No
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Additional Information
        </h2>
        <p className="text-muted-foreground">A few more details about your availability</p>
      </div>

      <div className="space-y-6">
        <PollQuestion
          label="Do you have a look-alike twin?"
          field="hasLookAlikeTwin"
          value={data.hasLookAlikeTwin}
        />

        <PollQuestion
          label="Do you own a car?"
          field="hasCar"
          value={data.hasCar}
        />

        <PollQuestion
          label="Do you have a driving license?"
          field="hasLicense"
          value={data.hasLicense}
        />

        <PollQuestion
          label="Are you willing to travel?"
          field="canTravel"
          value={data.canTravel}
        />

        <PollQuestion
          label="Do you have a valid passport?"
          field="hasPassport"
          value={data.hasPassport}
        />

        <PollQuestion
          label="Do you have more than one passport?"
          field="hasMultiplePassports"
          value={data.hasMultiplePassports}
        />

        {data.hasMultiplePassports === "yes" && (
          <div className="space-y-3">
            <Label>Select your passports (up to 3)</Label>
            {data.passports.length < 3 && (
              <Select
                value=""
                onValueChange={(value) => {
                  if (!data.passports.includes(value) && data.passports.length < 3) {
                    onChange("passports", [...data.passports, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add a passport" />
                </SelectTrigger>
                <SelectContent>
                  {nationalities.map((nationality) => (
                    <SelectItem
                      key={nationality}
                      value={nationality}
                      disabled={data.passports.includes(nationality)}
                    >
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {data.passports.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.passports.map((passport) => (
                  <div
                    key={passport}
                    className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm font-medium">{passport}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange(
                          "passports",
                          data.passports.filter((p) => p !== passport)
                        )
                      }
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityStep;