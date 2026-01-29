import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormProgress from "./FormProgress";
import WelcomeStep from "./steps/WelcomeStep";
import MainInfoStep from "./steps/MainInfoStep";
import ContactStep from "./steps/ContactStep";
import AddressStep from "./steps/AddressStep";
import AppearanceStep from "./steps/AppearanceStep";
import MeasurementsStep from "./steps/MeasurementsStep";
import TalentsStep from "./steps/TalentsStep";
import AvailabilityStep from "./steps/AvailabilityStep";
import ReviewStep from "./steps/ReviewStep";
import { mainInfoSchema, contactSchema, addressSchema, languagesSchema, appearanceSchema, measurementsSchema } from "@/lib/formValidation";
import { submitApplication } from "@/lib/submitApplication";
interface FormData {
  gender: "male" | "female";
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
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
  governorate: string;
  district: string;
  area: string;
  languages: string[];
  languageLevels: Record<string, number>;
  customLanguage: string;
  height: string;
  weight: string;
  pantSize: string;
  jacketSize: string;
  shoeSize: string;
  bust: string;
  waist: string;
  hips: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  hairLength: string;
  skinTone: string;
  hasTattoos: boolean;
  hasPiercings: boolean;
  customEyeColor: string;
  customHairColor: string;
  shoulders: string;
  talents: string[];
  talentLevels: Record<string, number>;
  sports: string[];
  sportLevels: Record<string, number>;
  modeling: string[];
  customTalent: string;
  customSport: string;
  customModeling: string;
  experience: string;
  interestedInExtra: string;
  hasCar: string;
  hasLicense: string;
  isEmployed: string;
  canTravel: string;
  hasPassport: string;
  hasMultiplePassports: string;
  passports: string[];
  comfortableWithSwimwear: boolean | null;
  cameraConfidence: number;
  hasLookAlikeTwin: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
}
const initialFormData: FormData = {
  gender: "female",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  nationality: "",
  email: "",
  mobile: "",
  mobileCountryCode: "+961",
  whatsapp: "",
  whatsappCountryCode: "+961",
  otherNumber: "",
  otherNumberCountryCode: "+961",
  otherNumberRelationship: "",
  otherNumberPersonName: "",
  instagram: "",
  hasWhishAccount: "",
  whishNumber: "",
  whishCountryCode: "+961",
  governorate: "",
  district: "",
  area: "",
  languages: [],
  languageLevels: {},
  customLanguage: "",
  height: "",
  weight: "",
  pantSize: "",
  jacketSize: "",
  shoeSize: "",
  bust: "",
  waist: "",
  hips: "",
  eyeColor: "",
  hairColor: "",
  hairType: "",
  hairLength: "",
  skinTone: "",
  hasTattoos: false,
  hasPiercings: false,
  customEyeColor: "",
  customHairColor: "",
  shoulders: "",
  talents: [],
  talentLevels: {},
  sports: [],
  sportLevels: {},
  modeling: [],
  customTalent: "",
  customSport: "",
  customModeling: "",
  experience: "",
  interestedInExtra: "",
  hasCar: "",
  hasLicense: "",
  isEmployed: "",
  canTravel: "",
  hasPassport: "",
  hasMultiplePassports: "",
  passports: [],
  comfortableWithSwimwear: null,
  cameraConfidence: 0,
  hasLookAlikeTwin: "",
  howDidYouHear: "",
  howDidYouHearOther: ""
};
const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    toast
  } = useToast();
  const totalSteps = 9;
  const updateFormData = (field: string, value: string | string[] | boolean | number | File | null | Record<string, number>) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleProceed = () => {
    setCurrentStep(1);
  };
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        {
          const result = mainInfoSchema.safeParse(formData);
          if (!result.success) {
            const firstError = result.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          break;
        }
      case 2:
        {
          const result = contactSchema.safeParse(formData);
          if (!result.success) {
            const firstError = result.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          break;
        }
      case 3:
        {
          // Validate both address and languages
          const addressResult = addressSchema.safeParse(formData);
          if (!addressResult.success) {
            const firstError = addressResult.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          const langResult = languagesSchema.safeParse(formData);
          if (!langResult.success) {
            const firstError = langResult.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          break;
        }
      case 4:
        {
          const result = appearanceSchema.safeParse(formData);
          if (!result.success) {
            const firstError = result.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          break;
        }
      case 5:
        {
          const result = measurementsSchema.safeParse(formData);
          if (!result.success) {
            const firstError = result.error.errors[0];
            toast({
              title: "Validation Error",
              description: firstError.message,
              variant: "destructive"
            });
            return false;
          }
          break;
        }
    }
    return true;
  };
  const handleNext = (skipValidation = false) => {
    if (skipValidation || validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  const handleSkipNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitApplication(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "Thank you for registering with Faces Agency. We'll be in touch soon!"
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "There was an error submitting your application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Letter-by-letter animation for thank you page
  const [visibleLetters, setVisibleLetters] = useState(0);
  const facesLetters = [
    { char: "f", isRed: false },
    { char: "a", isRed: false },
    { char: "c", isRed: false },
    { char: "e", isRed: false },
    { char: "s", isRed: true },
  ];

  // Animate letters when submitted
  useEffect(() => {
    if (isSubmitted) {
      setVisibleLetters(0);
      const interval = setInterval(() => {
        setVisibleLetters((prev) => {
          if (prev < facesLetters.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 250); // Medium pace - 250ms per letter
      return () => clearInterval(interval);
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Animated FACES Logo */}
        <div className="flex items-center justify-center gap-0 mb-6">
          {facesLetters.map((letter, index) => (
            <span
              key={index}
              className={`text-5xl md:text-7xl font-bold tracking-wider transition-all duration-300 ${
                index < visibleLetters ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${letter.isRed ? "text-primary" : "text-foreground"}`}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {letter.char}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-wider" style={{
        fontFamily: "'Bebas Neue', sans-serif"
      }}>
          THANK YOU!
        </h1>
        <p className="text-lg text-foreground mb-6">
          Your application has been submitted successfully.
        </p>
        <p className="text-muted-foreground max-w-md mb-8">
          Keep an eye on your WhatsApp — our team will reach out to you soon!
        </p>
      </div>;
  }
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onProceed={handleProceed} />;
      case 1:
        return <MainInfoStep data={formData} onChange={updateFormData} />;
      case 2:
        return <ContactStep data={formData} onChange={updateFormData} className="my-[20px]" />;
      case 3:
        return <AddressStep data={formData} onChange={updateFormData} />;
      case 4:
        return <AppearanceStep data={formData} onChange={updateFormData} />;
      case 5:
        return <MeasurementsStep data={formData} gender={formData.gender} onChange={updateFormData} />;
      case 6:
        return <TalentsStep data={formData} onChange={updateFormData} />;
      case 7:
        return <AvailabilityStep data={formData} onChange={updateFormData} />;
      case 8:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} onChange={updateFormData} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      {currentStep > 0 && <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4">
          <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <FormProgress currentStep={currentStep} totalSteps={totalSteps - 1} />
          </div>
        </div>}

      {/* Form Content */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          <div className="animate-fade-in-up">{renderStep()}</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentStep > 0 && currentStep < totalSteps - 1 && <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 md:px-6 py-4">
          <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto flex gap-3 md:gap-4">
            <Button variant="outline" onClick={handleBack} className="h-12 md:h-14 md:text-base px-4">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button onClick={() => handleNext()} className="flex-1 h-12 md:h-14 md:text-base">
              Next
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
            <Button variant="outline" onClick={handleSkipNext} className="h-12 md:h-14 md:text-base px-4">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>}

      {/* Back button only for review step */}
      {currentStep === totalSteps - 1 && <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 md:px-6 py-4">
          <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <Button variant="outline" onClick={handleBack} className="w-full h-12 md:h-14 md:text-base" disabled={isSubmitting}>
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Back to Edit
            </Button>
          </div>
        </div>}
    </div>;
};
export default RegistrationForm;