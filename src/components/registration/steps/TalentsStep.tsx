import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { talents, sports, modelingTypes } from "@/data/lebanese-locations";
import { Check, ChevronDown, X, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TalentsStepProps {
  data: {
    talents: string[];
    talentLevels?: Record<string, number>;
    sports: string[];
    sportLevels?: Record<string, number>;
    modeling: string[];
    experience: string;
    customTalent?: string;
    customSport?: string;
    customModeling?: string;
    comfortableWithSwimwear: boolean | null;
    interestedInExtra: string;
    cameraConfidence: number;
  };
  onChange: (field: string, value: string | string[] | boolean | number | Record<string, number>) => void;
}

const TalentsStep = ({ data, onChange }: TalentsStepProps) => {
  const [customModeling, setCustomModeling] = useState(data.customModeling || "");
  const [isModelingOpen, setIsModelingOpen] = useState(false);
  const [modelingSearchQuery, setModelingSearchQuery] = useState("");

  const talentLevels = data.talentLevels || {};
  const sportLevels = data.sportLevels || {};
  const selectedTalents = data.talents || [];
  const selectedSports = data.sports || [];
  const selectedModeling = data.modeling || [];

  const maxItems = 5;

  // Available talents/sports for dropdown (excluding already selected)
  const availableTalents = talents.filter(t => !selectedTalents.includes(t) && t !== "Other");
  const availableSports = sports.filter(s => !selectedSports.includes(s) && s !== "Other");

  const filteredModeling = modelingSearchQuery.trim() 
    ? modelingTypes.filter((type) => type.toLowerCase().includes(modelingSearchQuery.toLowerCase()))
    : modelingTypes;

  const handleAddTalent = (talent: string) => {
    if (selectedTalents.length < maxItems && !selectedTalents.includes(talent)) {
      const newTalents = [...selectedTalents, talent];
      const newLevels = { ...talentLevels, [talent]: 3 };
      onChange("talents", newTalents);
      onChange("talentLevels", newLevels);
    }
  };

  const handleRemoveTalent = (talent: string) => {
    const newTalents = selectedTalents.filter(t => t !== talent);
    const newLevels = { ...talentLevels };
    delete newLevels[talent];
    onChange("talents", newTalents);
    onChange("talentLevels", newLevels);
  };

  const handleTalentLevelChange = (talent: string, level: number) => {
    const newLevels = { ...talentLevels, [talent]: level };
    onChange("talentLevels", newLevels);
  };

  const handleAddSport = (sport: string) => {
    if (selectedSports.length < maxItems && !selectedSports.includes(sport)) {
      const newSports = [...selectedSports, sport];
      const newLevels = { ...sportLevels, [sport]: 3 };
      onChange("sports", newSports);
      onChange("sportLevels", newLevels);
    }
  };

  const handleRemoveSport = (sport: string) => {
    const newSports = selectedSports.filter(s => s !== sport);
    const newLevels = { ...sportLevels };
    delete newLevels[sport];
    onChange("sports", newSports);
    onChange("sportLevels", newLevels);
  };

  const handleSportLevelChange = (sport: string, level: number) => {
    const newLevels = { ...sportLevels, [sport]: level };
    onChange("sportLevels", newLevels);
  };

  const handleModelingToggle = (type: string) => {
    const currentModeling = data.modeling || [];
    if (currentModeling.includes(type)) {
      onChange("modeling", currentModeling.filter((m) => m !== type));
    } else if (currentModeling.length < maxItems) {
      onChange("modeling", [...currentModeling, type]);
    }
  };

  const handleRemoveModeling = (type: string) => {
    const currentModeling = data.modeling || [];
    onChange("modeling", currentModeling.filter((m) => m !== type));
    if (type === "Other") {
      setCustomModeling("");
      onChange("customModeling", "");
    }
  };

  const handleCustomModelingChange = (value: string) => {
    setCustomModeling(value);
    onChange("customModeling", value);
  };

  const hasModelingOtherSelected = selectedModeling.includes("Other");

  const StarRating = ({ item, level, onLevelChange }: { item: string; level: number; onLevelChange: (item: string, level: number) => void }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLevelChange(item, star);
          }}
          className="p-0"
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              star <= level
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground"
            }`}
          />
        </button>
      ))}
      <span className="text-[10px] text-muted-foreground ml-1.5">
        {level === 1 && "Beginner"}
        {level === 2 && "Elementary"}
        {level === 3 && "Intermediate"}
        {level === 4 && "Advanced"}
        {level === 5 && "Expert"}
      </span>
    </div>
  );

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
          Talents & Experience
        </h2>
        <p className="text-muted-foreground">What are your skills and experience?</p>
      </div>

      <div className="space-y-6">
        {/* Talents Section */}
        <div className="space-y-3">
          <Label>Talents & Skills</Label>
          <p className="text-muted-foreground text-sm">Select up to 5 talents and rate your proficiency</p>
          
          {selectedTalents.length < maxItems && (
            <Select onValueChange={handleAddTalent} value="">
              <SelectTrigger className="h-12">
                <SelectValue placeholder={`Select talent (${maxItems - selectedTalents.length} left)`} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableTalents.map((talent) => (
                  <SelectItem key={talent} value={talent}>
                    {talent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Selected Talents with Star Ratings */}
          {selectedTalents.length > 0 && (
            <div className="grid grid-cols-1 gap-3 mt-3">
              {selectedTalents.map((talent) => (
                <div
                  key={talent}
                  className="flex flex-col p-3 rounded-lg border border-primary bg-primary/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{talent}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTalent(talent)}
                      className="p-0.5 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                  <StarRating 
                    item={talent} 
                    level={talentLevels[talent] || 3}
                    onLevelChange={handleTalentLevelChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sports Section */}
        <div className="space-y-3 pt-6 border-t border-border">
          <Label>Sports & Fitness</Label>
          <p className="text-muted-foreground text-sm">Select up to 5 sports and rate your proficiency</p>
          
          {selectedSports.length < maxItems && (
            <Select onValueChange={handleAddSport} value="">
              <SelectTrigger className="h-12">
                <SelectValue placeholder={`Select sport (${maxItems - selectedSports.length} left)`} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableSports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Selected Sports with Star Ratings */}
          {selectedSports.length > 0 && (
            <div className="grid grid-cols-1 gap-3 mt-3">
              {selectedSports.map((sport) => (
                <div
                  key={sport}
                  className="flex flex-col p-3 rounded-lg border border-primary bg-primary/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{sport}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSport(sport)}
                      className="p-0.5 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                  <StarRating 
                    item={sport} 
                    level={sportLevels[sport] || 3}
                    onLevelChange={handleSportLevelChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <PollQuestion
          label="Do you have previous acting and modeling experience?"
          field="experience"
          value={data.experience}
        />
        <p className="text-xs text-muted-foreground text-center -mt-3">
          No experience? No problem! We welcome fresh faces.
        </p>

        {/* Camera confidence rating */}
        <div className="space-y-3">
          <Label>How would you rate your confidence in speaking in front of the camera?</Label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange("cameraConfidence", star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (data.cameraConfidence || 0)
                      ? "fill-primary text-primary"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
        </div>

        {/* Modeling dropdown */}
        <div className="space-y-2">
          <Label>What kind of modeling would you be interested in or have experience in?</Label>
          
          {selectedModeling.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedModeling.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => handleRemoveModeling(type)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelingOpen(!isModelingOpen)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors text-left"
            >
              <span className="text-muted-foreground">
                {selectedModeling.length === 0
                  ? "Select modeling types (max 5)..."
                  : `${selectedModeling.length}/${maxItems} selected`}
              </span>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isModelingOpen ? "rotate-180" : ""}`} />
            </button>

            {isModelingOpen && (
              <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search modeling types..."
                      value={modelingSearchQuery}
                      onChange={(e) => setModelingSearchQuery(e.target.value)}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {filteredModeling.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No modeling types found
                    </div>
                  ) : (
                    filteredModeling.map((type) => {
                      const isSelected = selectedModeling.includes(type);
                      const isDisabled = !isSelected && selectedModeling.length >= maxItems;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => !isDisabled && handleModelingToggle(type)}
                          disabled={isDisabled}
                          className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left ${
                            isSelected ? "bg-primary/5 hover:bg-primary/10" : ""
                          } ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"}`}
                        >
                          <span className={isSelected ? "text-primary font-medium" : "text-foreground"}>
                            {type}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {hasModelingOtherSelected && (
            <Input
              placeholder="Specify your other modeling type..."
              value={customModeling}
              onChange={(e) => handleCustomModelingChange(e.target.value)}
              className="mt-3"
            />
          )}
        </div>

        {/* Swimwear comfort question */}
        <div className="space-y-3">
          <Label>Are you comfortable modeling swimwear?</Label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => onChange("comfortableWithSwimwear", true)}
              className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                data.comfortableWithSwimwear === true
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <span className={`text-lg font-semibold ${
                data.comfortableWithSwimwear === true ? "text-primary" : "text-foreground"
              }`}>
                Yes
              </span>
            </div>
            <div
              onClick={() => onChange("comfortableWithSwimwear", false)}
              className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all ${
                data.comfortableWithSwimwear === false
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <span className={`text-lg font-semibold ${
                data.comfortableWithSwimwear === false ? "text-primary" : "text-foreground"
              }`}>
                No
              </span>
            </div>
          </div>
        </div>

        {/* Extra/Background actor question */}
        <PollQuestion
          label="If needed, would you be interested in casting as a Background Actor/Extra/Comparse?"
          field="interestedInExtra"
          value={data.interestedInExtra}
        />

      </div>

      {/* Click outside to close */}
      {isModelingOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsModelingOpen(false)}
        />
      )}
    </div>
  );
};

export default TalentsStep;