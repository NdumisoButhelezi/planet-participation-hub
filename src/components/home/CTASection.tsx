
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 ice-overlay"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div data-aos="zoom-in" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 pluto-gradient-text">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of learners who are advancing their careers with PlutoDev
          </p>
          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg shadow-lg transition-transform hover:scale-105 frost-slide"
          >
            <span className="relative z-10">Get Started Today</span> <ArrowRight className="ml-2 w-5 h-5 frost-float" />
          </Button>
          
          {/* Decorative frost elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-blue-50 rounded-full opacity-30 frost-grow"></div>
          <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-20 frost-shimmer"></div>
          <div className="absolute top-1/2 left-10 w-12 h-12 bg-indigo-50 rounded-full opacity-40 frost-float"></div>
          <div className="absolute bottom-0 right-10 w-24 h-24 bg-blue-50 rounded-full opacity-30 frost-grow"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
