
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import ProgramAgreementDialog from "@/components/shared/ProgramAgreementDialog";
import { 
  Brain, Trophy, Users, Calendar, ArrowRight, Github, 
  Linkedin, Globe, MessageSquare, Rocket, Award, 
  Timer, CheckCircle, BarChart, Code, Star, Database,
  Send
} from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Index = () => {
  const navigate = useNavigate();
  const [showAgreement, setShowAgreement] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true
    });
  }, []);

  const features = [
    {
      icon: <Trophy className="w-10 h-10 text-amber-500" />,
      title: "Competitive Learning",
      description: "Earn points and climb the leaderboard while mastering AI concepts"
    },
    {
      icon: <Rocket className="w-10 h-10 text-blue-600" />,
      title: "AI Projects",
      description: "Build real-world AI applications with hands-on guidance"
    },
    {
      icon: <Users className="w-10 h-10 text-green-600" />,
      title: "Community",
      description: "Join a thriving community of AI enthusiasts"
    },
    {
      icon: <Timer className="w-10 h-10 text-purple-600" />,
      title: "Weekly Challenges",
      description: "Regular assignments to keep you engaged and learning"
    },
    {
      icon: <Code className="w-10 h-10 text-pink-600" />,
      title: "Coding Sessions",
      description: "Participate in live coding sessions with industry experts"
    },
    {
      icon: <Database className="w-10 h-10 text-cyan-600" />,
      title: "AI Resources",
      description: "Access a comprehensive library of AI and ML resources"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "100+", label: "AI Projects" },
    { number: "50+", label: "Weekly Winners" },
    { number: "1000+", label: "Points Awarded" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-transparent bg-clip-text">
                Planet 09 AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-gray-600 hover:text-indigo-600">
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                  onClick={() => setShowAgreement(true)}
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" data-aos="fade-up">Why Choose Planet 09 AI?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">Our platform combines the best of AI education with gamified learning experiences</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                className="p-8 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
              >
                <div className="mb-4 bg-indigo-50 p-4 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" data-aos="fade-up">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                data-aos="zoom-in" 
                data-aos-delay={index * 100}
                className="p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" data-aos="fade-up">
            What Our Students Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div data-aos="fade-up" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
              </div>
              <p className="text-gray-700 mb-4">"Planet 09 AI transformed how I learn machine learning. The gamification makes studying enjoyable and the challenges keep me engaged."</p>
              <div className="font-medium">- Sarah J., Data Scientist</div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="100" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
              </div>
              <p className="text-gray-700 mb-4">"The weekly challenges pushed me to improve my coding skills rapidly. The community is supportive and inspiring."</p>
              <div className="font-medium">- Marcus T., Software Engineer</div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="200" className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
                <Star className="text-yellow-500 w-5 h-5" />
              </div>
              <p className="text-gray-700 mb-4">"The practical projects helped me build a strong portfolio and land my dream job in AI. Highly recommended for serious learners."</p>
              <div className="font-medium">- Aisha R., AI Researcher</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="mb-8 text-indigo-100">Have questions about our AI learning platform? Send us a message and our team will get back to you.</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="text-indigo-300" />
                  <span>24/7 Support for enrolled students</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="text-indigo-300" />
                  <span>Weekly live Q&A sessions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="text-indigo-300" />
                  <span>Dedicated mentors for premium members</span>
                </div>
              </div>
            </div>
            
            <div data-aos="fade-left" className="bg-white/10 backdrop-blur-md p-8 rounded-xl">
              <form onSubmit={(e) => {
                e.preventDefault();
                // Form submission logic
                setEmail('');
                setMessage('');
              }} className="space-y-4">
                <div>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Your email"
                    className="bg-white/20 border-indigo-300 text-white placeholder:text-indigo-200"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you with AI learning?"
                    className="bg-white/20 border-indigo-300 text-white placeholder:text-indigo-200 min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-white text-indigo-900 hover:bg-indigo-100">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div data-aos="zoom-in" className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-transparent bg-clip-text">Ready to Start Your AI Journey?</h2>
            <p className="text-lg text-gray-700 mb-8">Join thousands of learners who are advancing their careers with Planet 09 AI</p>
            <Button 
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-8 py-6 rounded-full text-lg shadow-lg transition-transform hover:scale-105"
            >
              Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Planet 09 AI</span>
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
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Competitions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
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
