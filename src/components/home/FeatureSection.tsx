
import { Trophy, Rocket, Users, Timer, Code, Database, BookOpen, Shield, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureSection = () => {
  const features = [
    {
      icon: <Trophy className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />,
      title: "Competitive Learning",
      description: "Earn points and climb the leaderboard while mastering AI concepts"
    },
    {
      icon: <Rocket className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />,
      title: "AI Projects",
      description: "Build real-world AI applications with hands-on guidance"
    },
    {
      icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-green-600" />,
      title: "Community",
      description: "Join a thriving community of AI enthusiasts"
    },
    {
      icon: <Timer className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />,
      title: "Weekly Challenges",
      description: "Regular assignments to keep you engaged and learning"
    },
    {
      icon: <Code className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />,
      title: "Coding Sessions",
      description: "Participate in live coding sessions with industry experts"
    },
    {
      icon: <Database className="w-8 h-8 md:w-10 md:h-10 text-cyan-600" />,
      title: "AI Resources",
      description: "Access a comprehensive library of AI and ML resources"
    }
  ];

  const authSeries = [
    {
      module: "📘 Module 1: Introduction to Authentication",
      title: "EP 01: Overview of Firebase Authentication",
      tech: "🔗 Android Studio + Java + Python + VS Code + Firebase Realtime DB",
      link: "https://youtu.be/SHFIuz0wrrE",
      icon: <Shield className="text-blue-500" />
    },
    {
      module: "📗 Module 2: Web App Auth",
      title: "EP 02: Login & Register with Flask (Python) + Firebase",
      tech: "",
      link: "https://youtu.be/spfIpRV_g80",
      icon: <BookOpen className="text-green-500" />
    },
    {
      module: "📙 Module 3: Real App Integration",
      title: "EP 03: Clone & Run a Home Affairs Booking App",
      tech: "🔗 Android Studio + Java + GitHub",
      link: "https://youtu.be/Ln9zY8GM5kA",
      icon: <GitMerge className="text-orange-500" />
    },
    {
      module: "📕 Module 4: Deep Dive - Identity Auth",
      title: "EP 04: Identity Login & Registration Flow",
      tech: "",
      link: "https://youtu.be/2rGkWojr8Fg",
      icon: <Shield className="text-red-500" />
    },
    {
      module: "Module 5: TypeScript Vite Login & Register",
      title: "Modern Authentication with Vite",
      tech: "",
      link: "https://youtu.be/AKzBv9EnFew",
      icon: <Code className="text-indigo-500" />
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 
          className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" 
          data-aos="fade-up"
        >
          Why Choose Planet 09 AI?
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto" 
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          Our platform combines the best of AI education with gamified learning experiences
        </p>
        
        {/* Feature image */}
        <div className="mb-12 text-center" data-aos="fade-up">
          <img 
            src="https://i.ibb.co/HTRvkP5/Chat-GPT-Image-Apr-13-2025-04-08-19-PM.png" 
            alt="Planet 09 AI Ecosystem" 
            className="max-w-full rounded-xl shadow-lg mx-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="p-5 md:p-8 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="mb-4 bg-indigo-50 p-3 md:p-4 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Authentication Series Section */}
        <div className="mt-20">
          <h2 
            className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" 
            data-aos="fade-up"
          >
            Authentication Series
          </h2>
          <p 
            className="text-sm md:text-base text-gray-600 text-center mb-8 max-w-2xl mx-auto" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            For those who wish to know about projects regarding authentication in different languages
          </p>

          <div className="space-y-4 md:space-y-6" data-aos="fade-up">
            {authSeries.map((series, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-4 md:p-6 border border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    {series.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-indigo-600 font-medium">{series.module}</p>
                    <h3 className="text-lg font-bold text-gray-800 my-1">{series.title}</h3>
                    {series.tech && <p className="text-sm text-gray-500 mb-2">{series.tech}</p>}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      onClick={() => window.open(series.link, '_blank')}
                    >
                      Watch Video
                    </Button>
                  </div>
                  <div className="md:w-1/3 flex justify-end">
                    <img 
                      src={`https://img.youtube.com/vi/${series.link.split('v=')[1]?.split('&')[0] || series.link.split('/').pop()}/mqdefault.jpg`} 
                      alt={series.title} 
                      className="rounded-md w-full max-w-[160px] h-auto shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              onClick={() => window.open('https://www.youtube.com/watch?v=MCg9-mihmsI', '_blank')}
            >
              Watch Week 04 Video
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
