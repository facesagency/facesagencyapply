import { useState } from "react";
import { Info, X } from "lucide-react";

/**
 * Small ℹ️ helper note. Tapping the icon toggles a short explanation
 * in simple English for questions applicants might not understand.
 */
const InfoNote = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-flex items-center align-middle">
      <button
        type="button"
        aria-label={open ? "Hide explanation" : "What does this mean?"}
        onClick={() => setOpen(!open)}
        className="ml-1.5 p-0.5 text-muted-foreground hover:text-primary transition-colors"
      >
        {open ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
      </button>
      {open && (
        <span className="block w-full mt-1 text-xs text-muted-foreground bg-muted/60 rounded-md px-3 py-2 leading-relaxed">
          {text}
        </span>
      )}
    </span>
  );
};

export default InfoNote;
