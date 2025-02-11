
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProgramAgreementDialog from "@/components/shared/ProgramAgreementDialog";
import { Youtube, Github, Linkedin, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showAgreement, setShowAgreement] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Bubble Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-10">
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
      
      <main className="flex-1 container mx-auto px-6 py-12 relative z-10">
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

      <footer className="relative z-10 mt-auto bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg">Planet 09 AI</span>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="https://www.youtube.com/@NduAILearning" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/NdumisoButhelezi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/ndumiso-buthelezi-81581021b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} Planet 09 AI. All rights reserved.
          </div>
        </div>
      </footer>

      <ProgramAgreementDialog 
        open={showAgreement}
        onOpenChange={setShowAgreement}
      />
    </div>
  );
};

export default Index;
