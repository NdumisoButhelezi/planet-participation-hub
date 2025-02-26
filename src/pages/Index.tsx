
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProgramAgreementDialog from "@/components/shared/ProgramAgreementDialog";
import { Brain, Trophy, Users, Calendar, ArrowRight, Github, Linkedin, Globe, MessageSquare, Rocket, Award, Timer } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showAgreement, setShowAgreement] = useState(false);

  const features = [
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "Competitive Learning",
      description: "Earn points and climb the leaderboard while mastering AI concepts"
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: "AI Projects",
      description: "Build real-world AI applications with hands-on guidance"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community",
      description: "Join a thriving community of AI enthusiasts"
    },
    {
      icon: <Timer className="w-8 h-8 text-purple-600" />,
      title: "Weekly Challenges",
      description: "Regular assignments to keep you engaged and learning"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "100+", label: "AI Projects" },
    { number: "50+", label: "Weekly Winners" },
    { number: "1000+", label: "Points Awarded" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-transparent bg-clip-text">
                Planet 09 AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-gray-600 hover:text-blue-600">
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-transparent bg-clip-text">
                Learn AI & Compete on Planet 09
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join our gamified learning platform where you can earn points, climb the leaderboard, and master AI development while competing with peers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full flex items-center justify-center"
                >
                  Start Competing <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAgreement(true)}
                  className="border-blue-600 text-blue-600 px-8 py-6 rounded-full hover:bg-blue-50"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="AI Learning Platform"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Planet 09 AI?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">Planet 09 AI</span>
              </div>
              <p className="text-gray-400">Shaping the future of AI education</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.youtube.com/@NduAILearning" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-6 h-6" />
                </a>
                <a 
                  href="https://github.com/NdumisoButhelezi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/ndumiso-buthelezi-81581021b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Add form submission logic here
              }} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="How can we help you with software development?"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Planet 09 AI. All rights reserved.</p>
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
