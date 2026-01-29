import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Children's sizes
const childPantSizes = ["2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "16"];
const childJacketSizes = ["2T", "3T", "4T", "5", "6", "7", "8", "10", "12", "14", "16"];
const childShoeSizes = ["22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];

// Adult sizes
const adultPantSizes = ["28", "30", "32", "34", "36", "38", "40", "42", "44"];
const adultJacketSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const adultShoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];

// Combined sizes for dropdowns
const allPantSizes = [...childPantSizes, ...adultPantSizes];
const allJacketSizes = [...childJacketSizes, ...adultJacketSizes];
const allShoeSizes = [...childShoeSizes, ...adultShoeSizes];

const sizeGuides = {
  childPants: {
    title: "Children's Pants Size Guide",
    headers: ["US", "Age", "Height (cm)"],
    rows: [
      ["2T", "2 yrs", "84-89"],
      ["3T", "3 yrs", "89-97"],
      ["4T", "4 yrs", "97-104"],
      ["5", "5 yrs", "104-109"],
      ["6", "6 yrs", "109-117"],
      ["7", "7 yrs", "117-122"],
      ["8", "8 yrs", "122-128"],
      ["10", "9-10 yrs", "128-140"],
      ["12", "11-12 yrs", "140-152"],
      ["14", "13-14 yrs", "152-163"],
      ["16", "15-16 yrs", "163-168"],
    ],
  },
  childShoes: {
    title: "Children's Shoe Size Guide",
    headers: ["EU", "US", "Age"],
    rows: [
      ["22", "6", "1-2 yrs"],
      ["24", "8", "2-3 yrs"],
      ["26", "9.5", "3-4 yrs"],
      ["28", "11", "4-5 yrs"],
      ["30", "12.5", "5-6 yrs"],
      ["32", "1Y", "7-8 yrs"],
      ["34", "3Y", "9-10 yrs"],
      ["35", "4Y", "10-11 yrs"],
    ],
  },
  pants: {
    title: "Adult Pants Size Guide",
    headers: ["US", "UK", "EU"],
    rows: [
      ["28", "28", "44"],
      ["30", "30", "46"],
      ["32", "32", "48"],
      ["34", "34", "50"],
      ["36", "36", "52"],
      ["38", "38", "54"],
      ["40", "40", "56"],
    ],
  },
  jacket: {
    title: "Adult Jacket/Blouse Size Guide",
    headers: ["US", "UK", "EU"],
    rows: [
      ["XS", "6", "34"],
      ["S", "8-10", "36-38"],
      ["M", "12-14", "40-42"],
      ["L", "16", "44"],
      ["XL", "18", "46"],
      ["XXL", "20", "48"],
    ],
  },
  shoes: {
    title: "Adult Shoe Size Guide",
    headers: ["US Men", "UK", "EU"],
    rows: [
      ["7", "6", "39"],
      ["8", "7", "40"],
      ["9", "8", "42"],
      ["10", "9", "43"],
      ["11", "10", "44"],
      ["12", "11", "45"],
      ["13", "12", "46"],
    ],
  },
  womenBody: {
    title: "Women's Body Measurements",
    headers: ["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)"],
    rows: [
      ["XS (6)", "81-84", "61-64", "86-89"],
      ["S (8)", "84-89", "64-69", "89-94"],
      ["M (10)", "89-94", "69-74", "94-99"],
      ["L (12)", "94-99", "74-79", "99-104"],
      ["XL (14)", "99-104", "79-84", "104-109"],
      ["XXL (16)", "104-109", "84-89", "109-114"],
    ],
  },
};

const SizeGuideTable = ({ guide }: { guide: typeof sizeGuides.pants }) => (
  <div className="text-xs">
    <div className="font-semibold mb-2 text-foreground">{guide.title}</div>
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border">
          {guide.headers.map((header) => (
            <th key={header} className="px-2 py-1 text-left font-medium text-muted-foreground">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {guide.rows.map((row, idx) => (
          <tr key={idx} className="border-b border-border/50">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-2 py-1 text-foreground">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface MeasurementsStepProps {
  data: {
    height: string;
    weight: string;
    pantSize: string;
    jacketSize: string;
    shoeSize: string;
    bust: string;
    waist: string;
    hips: string;
    shoulders: string;
  };
  gender: "male" | "female";
  onChange: (field: string, value: string) => void;
}

const MeasurementsStep = ({ data, gender, onChange }: MeasurementsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Measurements
        </h2>
        <p className="text-muted-foreground">Your body measurements and sizes</p>
      </div>

      {/* Size Guide Panel */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Size Conversion Guide</span>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium mb-1">Children</div>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs bg-background hover:bg-accent border border-border rounded px-3 py-2 transition-colors">
                  Kids Clothing
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <SizeGuideTable guide={sizeGuides.childPants} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs bg-background hover:bg-accent border border-border rounded px-3 py-2 transition-colors">
                  Kids Shoes
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <SizeGuideTable guide={sizeGuides.childShoes} />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="text-xs text-muted-foreground font-medium mt-3 mb-1">Adults</div>
          <div className={`grid ${gender === "female" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"} gap-2`}>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs bg-background hover:bg-accent border border-border rounded px-3 py-2 transition-colors">
                  Pants
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <SizeGuideTable guide={sizeGuides.pants} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs bg-background hover:bg-accent border border-border rounded px-3 py-2 transition-colors">
                  {gender === "male" ? "Jacket" : "Blouse"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <SizeGuideTable guide={sizeGuides.jacket} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs bg-background hover:bg-accent border border-border rounded px-3 py-2 transition-colors">
                  Shoes
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <SizeGuideTable guide={sizeGuides.shoes} />
              </PopoverContent>
            </Popover>
            {gender === "female" && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-xs bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded px-3 py-2 transition-colors font-medium">
                    Body Guide
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <SizeGuideTable guide={sizeGuides.womenBody} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={data.height}
              onChange={(e) => onChange("height", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              placeholder="60"
              value={data.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="space-y-2">
            <Label htmlFor="pantSize" className="text-xs md:text-sm">Pant Size (US) *</Label>
            <Select value={data.pantSize} onValueChange={(value) => onChange("pantSize", value)}>
              <SelectTrigger className="h-12 md:h-14">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Children</div>
                {childPantSizes.map((size) => (
                  <SelectItem key={`child-${size}`} value={size}>{size}</SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">Adults</div>
                {adultPantSizes.map((size) => (
                  <SelectItem key={`adult-${size}`} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jacketSize" className="text-xs md:text-sm">{gender === "male" ? "Jacket" : "Blouse"} (US) *</Label>
            <Select value={data.jacketSize} onValueChange={(value) => onChange("jacketSize", value)}>
              <SelectTrigger className="h-12 md:h-14">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Children</div>
                {childJacketSizes.map((size) => (
                  <SelectItem key={`child-${size}`} value={size}>{size}</SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">Adults</div>
                {adultJacketSizes.map((size) => (
                  <SelectItem key={`adult-${size}`} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shoeSize" className="text-xs md:text-sm">Shoe Size (EU) *</Label>
            <Select value={data.shoeSize} onValueChange={(value) => onChange("shoeSize", value)}>
              <SelectTrigger className="h-12 md:h-14">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Children</div>
                {childShoeSizes.map((size) => (
                  <SelectItem key={`child-${size}`} value={size}>{size}</SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">Adults</div>
                {adultShoeSizes.map((size) => (
                  <SelectItem key={`adult-${size}`} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <div className="space-y-2">
            <Label htmlFor="waist">Waist (cm)</Label>
            <Input
              id="waist"
              type="number"
              placeholder="70"
              value={data.waist}
              onChange={(e) => onChange("waist", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bust">{gender === "male" ? "Chest" : "Bust"} (cm)</Label>
            <Input
              id="bust"
              type="number"
              placeholder="90"
              value={data.bust}
              onChange={(e) => onChange("bust", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hips">Hips (cm)</Label>
            <Input
              id="hips"
              type="number"
              placeholder="95"
              value={data.hips}
              onChange={(e) => onChange("hips", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shoulders">Shoulders (cm)</Label>
            <Input
              id="shoulders"
              type="number"
              placeholder="45"
              value={data.shoulders}
              onChange={(e) => onChange("shoulders", e.target.value)}
              className="h-12 md:h-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsStep;