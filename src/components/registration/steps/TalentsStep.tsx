import { Label } from "@/components/ui/label";
import { talents, sports, danceStyles, musicalInstruments } from "@/data/lebanese-locations";
import { X, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoNote from "../InfoNote";

interface TalentsStepProps {
  data: {
    talents: string[];
    danceStyles: string[];
    musicalInstruments: string[];
    instrumentLevels: Record<string, number>;
    sports: string[];
    experience: string;
    interestedInExtra: string;
    cameraConfidence: number;
    willingShaveBeard: string;
    aiProjectsInterest: string;
    alcoholAdsOk: string;
    gender: "" | "male" | "female";
    dateOfBirth: string;
  };
  onChange: (field: string, value: string | string[] | number | Record<string, number>) => void;
}

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return null;
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const maxItems = 5;

const TalentsStep = ({ data, onChange }: TalentsStepProps) => {
  const age = calculateAge(data.dateOfBirth);
  const isMale = data.gender === "male";
  const showBeard = isMale && age !== null && age >= 13;
  const showAlcohol = age !== null && age >= 18;

  const instrumentLevels = data.instrumentLevels || {};
  const selectedTalents = data.talents || [];
  const selectedDance = data.danceStyles || [];
  const selectedInstruments = data.musicalInstruments || [];
  const selectedSports = data.sports || [];

  // Generic add/remove for simple multi-select lists (no ratings)
  const addTo = (field: string, list: string[], value: string) => {
    if (list.length < maxItems && !list.includes(value)) {
      onChange(field, [...list, value]);
    }
  };
  const removeFrom = (field: string, list: string[], value: string) => {
    onChange(field, list.filter(v => v !== value));
  };

  const handleAddInstrument = (instrument: string) => {
    if (selectedInstruments.length < maxItems && !selectedInstruments.includes(instrument)) {
      onChange("musicalInstruments", [...selectedInstruments, instrument]);
      onChange("instrumentLevels", { ...instrumentLevels, [instrument]: 3 });
    }
  };
  const handleRemoveInstrument = (instrument: string) => {
    const newLevels = { ...instrumentLevels };
    delete newLevels[instrument];
    onChange("musicalInstruments", selectedInstruments.filter(i => i !== instrument));
    onChange("instrumentLevels", newLevels);
  };
  const handleInstrumentLevelChange = (instrument: string, level: number) => {
    onChange("instrumentLevels", { ...instrumentLevels, [instrument]: level });
  };

  const StarRating = ({ item, level, onLevelChange }: { item: string; level: number; onLevelChange: (item: string, level: number) => void }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => { e.stopPropagation(); onLevelChange(item, star); }}
          className="p-0"
        >
          <Star className={`w-4 h-4 transition-colors ${star <= level ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`} />
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

  /** Multi-select picker: dropdown + removable chips, no ratings */
  const ChipPicker = ({
    label,
    hint,
    field,
    options,
    selected,
    note,
  }: {
    label: string;
    hint?: string;
    field: string;
    options: readonly string[];
    selected: string[];
    note?: string;
  }) => {
    const available = options.filter(o => !selected.includes(o));
    return (
      <div className="space-y-3">
        <Label>
          {label}
          {note && <InfoNote text={note} />}
        </Label>
        {hint && <p className="text-muted-foreground text-sm">{hint}</p>}
        {selected.length < maxItems && (
          <Select onValueChange={(v) => addTo(field, selected, v)} value="">
            <SelectTrigger className="h-12">
              <SelectValue placeholder={`Select (${maxItems - selected.length} left)`} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {available.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selected.map((item) => (
              <div key={item} className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                <span className="text-sm font-medium">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFrom(field, selected, item)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /** Yes / No / (optional third) poll */
  const PollQuestion = ({
    label,
    field,
    value,
    note,
    third,
  }: {
    label: string;
    field: string;
    value: string;
    note?: string;
    third?: { key: string; label: string };
  }) => (
    <div className="space-y-3">
      <Label>
        {label}
        {note && <InfoNote text={note} />}
      </Label>
      <div className={`grid ${third ? "grid-cols-3" : "grid-cols-2"} gap-3`}>
        {[{ key: "yes", label: "Yes" }, { key: "no", label: "No" }, ...(third ? [third] : [])].map((opt) => (
          <div
            key={opt.key}
            onClick={() => onChange(field, opt.key)}
            className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
              value === opt.key
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <span className={`text-base font-semibold ${value === opt.key ? "text-primary" : "text-foreground"}`}>
              {opt.label}
            </span>
          </div>
        ))}
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
        <ChipPicker
          label="Talents & Skills"
          hint="Select up to 5 talents"
          field="talents"
          options={talents}
          selected={selectedTalents}
        />

        <div className="pt-6 border-t border-border">
          <ChipPicker
            label="Dance Styles"
            hint="Do you dance? Select up to 5 styles"
            field="danceStyles"
            options={danceStyles}
            selected={selectedDance}
          />
        </div>

        {/* Musical Instruments — with proficiency ratings */}
        <div className="space-y-3 pt-6 border-t border-border">
          <Label>Musical Instruments</Label>
          <p className="text-muted-foreground text-sm">Do you play? Select up to 5 instruments and rate your level</p>
          {selectedInstruments.length < maxItems && (
            <Select onValueChange={handleAddInstrument} value="">
              <SelectTrigger className="h-12">
                <SelectValue placeholder={`Select instrument (${maxItems - selectedInstruments.length} left)`} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {musicalInstruments.filter(i => !selectedInstruments.includes(i)).map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedInstruments.length > 0 && (
            <div className="grid grid-cols-1 gap-3 mt-3">
              {selectedInstruments.map((instrument) => (
                <div key={instrument} className="flex flex-col p-3 rounded-lg border border-primary bg-primary/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{instrument}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstrument(instrument)}
                      className="p-0.5 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                  <StarRating
                    item={instrument}
                    level={instrumentLevels[instrument] || 3}
                    onLevelChange={handleInstrumentLevelChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border">
          <ChipPicker
            label="Sports & Fitness"
            hint="Select up to 5 sports"
            field="sports"
            options={sports}
            selected={selectedSports}
          />
        </div>

        <PollQuestion
          label="Do you have previous acting and modeling experience?"
          field="experience"
          value={data.experience}
        />
        <p className="text-xs text-muted-foreground text-center -mt-3">
          No experience? No problem! We welcome fresh faces.
        </p>

        {/* Camera Confidence Rating */}
        <div className="space-y-3">
          <Label>
            How would you rate your confidence in speaking in front of the camera?
            <InfoNote text="How comfortable do you feel being filmed or photographed? Be honest — beginners are welcome." />
          </Label>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => onChange("cameraConfidence", star)} className="p-1">
                <Star className={`w-8 h-8 transition-colors ${star <= (data.cameraConfidence || 0) ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
        </div>

        <PollQuestion
          label="If needed, would you be interested in casting as a Background Actor/Extra/Comparse?"
          field="interestedInExtra"
          value={data.interestedInExtra}
          note="Extras appear in the background of ads and films. Great first experience, paid per day."
        />

        {showBeard && (
          <PollQuestion
            label="Are you willing to shave your beard for a role?"
            field="willingShaveBeard"
            value={data.willingShaveBeard}
            note="Some roles need a clean-shaven look. Answering 'Maybe' is fine — we'd discuss per project."
            third={{ key: "maybe", label: "Maybe" }}
          />
        )}

        <PollQuestion
          label="Are you open to AI-related projects (digital likeness, AI-generated content)?"
          field="aiProjectsInterest"
          value={data.aiProjectsInterest}
          note="Some brands create ads using AI with real people's faces and voices. This asks only if you're OPEN to hearing about such projects. Nothing is ever used without a separate signed agreement for each project."
          third={{ key: "more", label: "Want to know more" }}
        />

        {showAlcohol && (
          <PollQuestion
            label="Are you comfortable appearing in advertising for alcoholic beverages?"
            field="alcoholAdsOk"
            value={data.alcoholAdsOk}
            note="Only about appearing in advertisements for alcohol brands. It does not ask about your personal life."
          />
        )}
      </div>
    </div>
  );
};

export default TalentsStep;
