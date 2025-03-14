
import { Trophy, Rocket, Users, Timer, Code, Database } from "lucide-react";

const FeatureSection = () => {
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

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text" 
          data-aos="fade-up"
        >
          Why Choose Planet 09 AI?
        </h2>
        <p 
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" 
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          Our platform combines the best of AI education with gamified learning experiences
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="p-8 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="mb-4 bg-indigo-50 p-4 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
