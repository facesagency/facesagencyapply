interface WelcomeStepProps {
  onProceed: () => void;
}

const WelcomeStep = ({
  onProceed
}: WelcomeStepProps) => {
  return <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-between text-center px-4 py-12 md:py-16">
        
        {/* Top section - Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold tracking-wider" style={{
          fontFamily: "'Bebas Neue', sans-serif"
        }}>
            <span className="text-foreground">FACE</span>
            <span className="text-primary">S</span>
          </h1>
        </div>

        {/* Middle section - Tagline */}
        <div className="flex-1 flex flex-col items-center justify-start py-2 md:py-4">
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 md:mb-16 font-serif max-w-2xl font-semibold px-4 mt-8 md:mt-12">Want to have that chance to work, create, and be seen representing the best and most recognizable brands internationally?</p>
        </div>

        {/* Bottom section - Partner logos & CTA */}
        <div className="flex-shrink-0 w-full max-w-4xl mx-auto mb-8 md:mb-12 px-2 md:px-4">
          {/* Partner logos section */}
          <div className="w-full mb-8">
            <p className="text-muted-foreground text-center mb-4 text-base">Our Trusted Partners</p>
            <div className="logo-scroll-wrapper">
              <div className="logo-scroll-track">
                <img alt="Partners" className="h-28 md:h-36 lg:h-44 object-contain px-8" src="/lovable-uploads/07543e1b-278c-4ebb-bb58-a8107bf32277.png" />
              </div>
            </div>
          </div>

          {/* Apply button */}
          <button onClick={onProceed} className="py-6 md:py-8 px-12 md:px-16 border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group rounded-xl">
            <span className="text-xl md:text-2xl lg:text-3xl transition-colors font-semibold text-foreground group-hover:text-primary font-sans">Apply Now</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-background py-6">
        <p className="text-xs text-muted-foreground/60 text-center px-4">
          Note: Due to high demand, not everyone will be selected.
        </p>
      </div>
    </div>;
};
export default WelcomeStep;