import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { eyeColors, hairColors, hairTypes, hairLengths, skinTones } from "@/data/lebanese-locations";

interface AppearanceStepProps {
  data: {
    eyeColor: string;
    hairColor: string;
    hairType: string;
    hairLength: string;
    skinTone: string;
    hasTattoos: boolean;
    hasPiercings: boolean;
    customEyeColor?: string;
    customHairColor?: string;
  };
  onChange: (field: string, value: string | boolean) => void;
}

const AppearanceStep = ({ data, onChange }: AppearanceStepProps) => {
  const [showCustomEyeColor, setShowCustomEyeColor] = useState(data.eyeColor === "Other");
  const [showCustomHairColor, setShowCustomHairColor] = useState(data.hairColor === "Other");

  const handleEyeColorChange = (value: string) => {
    onChange("eyeColor", value);
    setShowCustomEyeColor(value === "Other");
    if (value !== "Other") {
      onChange("customEyeColor", "");
    }
  };

  const handleHairColorChange = (value: string) => {
    onChange("hairColor", value);
    setShowCustomHairColor(value === "Other");
    if (value !== "Other") {
      onChange("customHairColor", "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Appearance
        </h2>
        <p className="text-muted-foreground">Your hair, eyes, and skin features</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Eye Color *</Label>
          <Select
            value={data.eyeColor}
            onValueChange={handleEyeColorChange}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {eyeColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomEyeColor && (
            <Input
              placeholder="Specify eye color..."
              value={data.customEyeColor || ""}
              onChange={(e) => onChange("customEyeColor", e.target.value)}
              className="h-12 mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Hair Color *</Label>
          <Select
            value={data.hairColor}
            onValueChange={handleHairColorChange}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {hairColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomHairColor && (
            <Input
              placeholder="Specify hair color..."
              value={data.customHairColor || ""}
              onChange={(e) => onChange("customHairColor", e.target.value)}
              className="h-12 mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Hair Type *</Label>
          <Select
            value={data.hairType}
            onValueChange={(value) => onChange("hairType", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {hairTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Hair Length *</Label>
          <Select
            value={data.hairLength}
            onValueChange={(value) => onChange("hairLength", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {hairLengths.map((length) => (
                <SelectItem key={length} value={length}>
                  {length}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Skin Tone *</Label>
          <Select
            value={data.skinTone}
            onValueChange={(value) => onChange("skinTone", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {skinTones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <Label htmlFor="tattoos" className="cursor-pointer">Do you have any tattoos?</Label>
          <Switch
            id="tattoos"
            checked={data.hasTattoos}
            onCheckedChange={(checked) => onChange("hasTattoos", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <Label htmlFor="piercings" className="cursor-pointer">Do you have any piercings?</Label>
          <Switch
            id="piercings"
            checked={data.hasPiercings}
            onCheckedChange={(checked) => onChange("hasPiercings", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AppearanceStep;