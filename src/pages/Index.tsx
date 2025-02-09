
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="text-xl font-semibold">Planet 09 AI</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Enhance Your Skills with Planet 09 AI
          </h1>
          <p className="text-xl text-gray-600">
            Join our platform to access curated learning paths, hands-on projects, and expert
            guidance tailored to your skill level.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate("/register")}>
              Start Learning
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
