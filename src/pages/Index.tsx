import { useState } from "react";
import LogoAnimation from "@/components/registration/LogoAnimation";
import RegistrationForm from "@/components/registration/RegistrationForm";

const Index = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <>
      {showAnimation && (
        <LogoAnimation onComplete={() => setShowAnimation(false)} />
      )}
      
      <div
        className={`transition-opacity duration-500 ${
          showAnimation ? "opacity-0" : "opacity-100"
        }`}
      >
        <RegistrationForm />
      </div>
    </>
  );
};

export default Index;