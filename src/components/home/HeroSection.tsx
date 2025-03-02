
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onShowAgreement: () => void;
}

const HeroSection = ({ onShowAgreement }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-transparent bg-clip-text">
              Learn AI & Compete on Planet 09
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Join our gamified learning platform where you can earn points, climb the leaderboard, and master AI development while competing with peers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white px-8 py-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                Start Competing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={onShowAgreement}
                className="border-indigo-600 text-indigo-600 px-8 py-6 rounded-full hover:bg-indigo-50 transition-all shadow-md"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block" data-aos="fade-left">
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-3xl blur-lg"></div>
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="AI Learning Platform"
              className="rounded-2xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
