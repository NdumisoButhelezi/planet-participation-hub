
import { RocketIcon, ArrowRight, Snowflake, ThermometerSnowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  onShowAgreement: () => void;
}

const HeroSection = ({ onShowAgreement }: HeroSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Generate multiple snowflakes
  const snowflakes = [...Array(isMobile ? 10 : 15)].map((_, i) => (
    <div 
      key={i} 
      className="absolute animate-[snowfall_8s_linear_infinite]"
      style={{
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 10}%`,
        animationDuration: `${Math.random() * 8 + 4}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.7 + 0.3,
      }}
    >
      <Snowflake className="text-white h-3 w-3 sm:h-4 sm:w-4" />
    </div>
  ));

  return (
    <section 
      className="pt-20 md:pt-32 pb-16 md:pb-20 px-4 text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.85)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80') no-repeat center center",
        backgroundSize: "cover"
      }}
    >
      {/* Animated snowflakes */}
      {snowflakes}
      
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center relative z-10" data-aos="fade-up">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <ThermometerSnowflake className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-xs sm:text-sm md:text-base text-blue-100">Welcome to the Arctic Zone</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4 md:mb-6 text-white">
            Learn & Build with <span className="text-blue-200">PlutoDev</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-blue-100 mb-6 md:mb-8">
            Join our frost-powered learning platform where you can earn points, climb the leaderboard, and master software development while competing with peers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-white text-blue-700 hover:bg-blue-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 group w-full sm:w-auto"
            >
              Start Coding Today <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={onShowAgreement}
              className="border-2 border-white text-white bg-blue-600/30 hover:bg-white/20 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-full transition-all shadow-md w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ice border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/30 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
