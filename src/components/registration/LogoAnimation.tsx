import { useState, useEffect, useRef } from "react";
import cameraSound from "@/assets/camera-shutter.m4a";

interface LogoAnimationProps {
  onComplete: () => void;
}

const LogoAnimation = ({ onComplete }: LogoAnimationProps) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [logoFading, setLogoFading] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashPhase, setFlashPhase] = useState<"off" | "in" | "hold" | "out">("off");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // "faces" in lowercase with last 's' in red
  const letters = [
    { char: "f", isRed: false },
    { char: "a", isRed: false },
    { char: "c", isRed: false },
    { char: "e", isRed: false },
    { char: "s", isRed: true },
  ];

  // Play camera sound
  const playCameraSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(cameraSound);
      audio.volume = 1.0;
      audioRef.current = audio;
      audio.play().catch(err => {
        console.log("Audio play failed:", err);
      });
    } catch (e) {
      console.log("Audio not supported:", e);
    }
  };

  useEffect(() => {
    // Type in letters one by one (slower - 300ms per letter)
    const letterInterval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < letters.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 300);

    const lettersDuration = letters.length * 300;

    // After all letters shown, wait longer before starting logo fade out
    const logoFadeTimeout = setTimeout(() => {
      clearInterval(letterInterval);
      setLogoFading(true);
    }, lettersDuration + 600);

    // Play sound 250ms before flash starts
    const soundTimeout = setTimeout(() => {
      playCameraSound();
    }, lettersDuration + 750);

    // After logo fades, start flash
    const flashStartTimeout = setTimeout(() => {
      setShowFlash(true);
      setFlashPhase("in");
    }, lettersDuration + 1000);

    // Flash reaches full intensity
    const flashHoldTimeout = setTimeout(() => {
      setFlashPhase("hold");
    }, lettersDuration + 1200);

    // Complete - transition after audio finishes
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, lettersDuration + 1800);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(logoFadeTimeout);
      clearTimeout(flashStartTimeout);
      clearTimeout(soundTimeout);
      clearTimeout(flashHoldTimeout);
      clearTimeout(completeTimeout);
      // Don't pause audio on cleanup - let it finish playing
    };
  }, [onComplete, letters.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground overflow-hidden">
      {/* Camera Flash Effect - covers entire screen */}
      {showFlash && (
        <>
          {/* Main flash */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 100%)',
              animation: flashPhase === "in" 
                ? "cameraFlashIn 0.3s ease-out forwards" 
                : flashPhase === "hold" 
                  ? "none" 
                  : undefined,
              opacity: flashPhase === "in" ? 0 : 1,
            }}
          />
          {/* Flash burst rays */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 10deg, transparent 20deg, rgba(255,255,255,0.2) 30deg, transparent 40deg, rgba(255,255,255,0.3) 50deg, transparent 60deg)',
              animation: flashPhase === "in" ? "flashBurst 0.4s ease-out forwards" : undefined,
              opacity: flashPhase === "in" ? 0 : flashPhase === "hold" ? 0.5 : 0,
            }}
          />
        </>
      )}

      {/* Logo Letters */}
      <div 
        className={`flex items-center justify-center gap-0 transition-opacity duration-500 ${
          logoFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`text-7xl md:text-9xl font-bold tracking-wider ${
              index < visibleLetters ? "animate-type-in" : "opacity-0"
            } ${letter.isRed ? "text-primary" : "text-background"}`}
            style={{
              animationDelay: `${index * 0.12}s`,
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LogoAnimation;