
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div data-aos="zoom-in" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-transparent bg-clip-text">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of learners who are advancing their careers with PlutoDev
          </p>
          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-8 py-6 rounded-full text-lg shadow-lg transition-transform hover:scale-105"
          >
            Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
