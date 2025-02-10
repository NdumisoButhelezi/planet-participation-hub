
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProgramAgreementDialog from "@/components/shared/ProgramAgreementDialog";

const Index = () => {
  const navigate = useNavigate();
  const [showAgreement, setShowAgreement] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="text-xl font-semibold text-white">Planet 09 AI</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-white hover:text-white hover:bg-white/20">
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")} className="bg-white text-blue-600 hover:bg-white/90">
            Get Started
          </Button>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
              Enhance Your Skills with Planet 09 AI
            </h1>
            <p className="text-xl text-white/80">
              Join our platform to access curated learning paths, hands-on projects, and expert
              guidance tailored to your skill level.
            </p>
          </div>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowAgreement(true)}
              className="text-white border-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { title: "Projects", description: "Build real-world projects" },
              { title: "Workshops", description: "Learn from industry experts" },
              { title: "Community", description: "Connect with peers" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ProgramAgreementDialog 
        open={showAgreement}
        onOpenChange={setShowAgreement}
      />
    </div>
  );
};

export default Index;
