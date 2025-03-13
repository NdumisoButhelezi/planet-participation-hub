
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onShowAgreement: () => void;
}

const HeroSection = ({ onShowAgreement }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section 
      className="pt-32 pb-20 px-4 text-white relative"
      style={{
        background: "linear-gradient(rgba(67, 56, 202, 0.85), rgba(79, 70, 229, 0.85)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80') no-repeat center center",
        backgroundSize: "cover"
      }}
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
            Learn AI & Compete on Planet 09
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            Join our gamified learning platform where you can earn points, climb the leaderboard, and master AI development while competing with peers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-900 hover:bg-indigo-100 px-8 py-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
              Start Competing <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={onShowAgreement}
              className="border-2 border-white text-white bg-indigo-800/30 hover:bg-white/20 px-8 py-6 rounded-full transition-all shadow-md"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
