
import React from "react";
import { Brain, ArrowLeft, Rocket, Users, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-transparent bg-clip-text">
                Planet 09 AI
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-indigo-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              About Planet 09 AI
            </h1>
            <p className="text-xl text-gray-700">
              Where learning meets innovation, competition, and community
            </p>
          </div>

          <div className="space-y-16">
            <section className="grid md:grid-cols-2 gap-8 items-center" data-aos="fade-up">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  Planet 09 AI was founded with a single mission: to make learning artificial intelligence accessible, 
                  engaging, and community-driven for everyone. We believe that the future belongs to those who understand 
                  how to harness the power of AI, and we're dedicated to ensuring that future is open to all.
                </p>
                <p className="text-gray-700">
                  Through our gamified learning environment, we transform what could be a complex, isolating journey into 
                  an exciting, collaborative adventure where peers learn from and compete with each other.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Rocket className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-2 text-gray-800">Innovation-Driven</h3>
                <p className="text-gray-600 text-center">
                  We constantly evolve our platform to incorporate the latest AI developments and teaching methodologies.
                </p>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8 items-center" data-aos="fade-up">
              <div className="bg-white p-6 rounded-xl shadow-lg md:order-first">
                <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-2 text-gray-800">Community-Centered</h3>
                <p className="text-gray-600 text-center">
                  Our platform thrives on collaboration. Students learn from experts and each other, building a network that extends beyond the classroom.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">Our Community</h2>
                <p className="text-gray-700 mb-4">
                  Planet 09 AI isn't just a learning platform—it's a vibrant community of learners, educators, and AI enthusiasts. 
                  From beginners taking their first steps into programming to advanced practitioners pushing the boundaries of what's possible, 
                  our community is diverse, supportive, and united by a passion for technology.
                </p>
                <p className="text-gray-700">
                  Through collaborative challenges, peer reviews, and community events, we foster connections that help everyone grow faster and 
                  reach higher than they could alone.
                </p>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8 items-center" data-aos="fade-up">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-700">Our Approach</h2>
                <p className="text-gray-700 mb-4">
                  Traditional education often falls short when it comes to emerging technologies. That's why we've 
                  pioneered a learning approach that combines structured curriculum with competitive elements, real-world 
                  projects, and community engagement.
                </p>
                <p className="text-gray-700">
                  By earning points, climbing leaderboards, and receiving immediate feedback, students stay motivated 
                  while building a portfolio of work that demonstrates their abilities to future employers or clients.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-2 text-gray-800">Achievement-Oriented</h3>
                <p className="text-gray-600 text-center">
                  We celebrate progress with a point system, leaderboards, and recognition that motivates continuous learning and improvement.
                </p>
              </div>
            </section>

            <section className="text-center" data-aos="fade-up">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700">Join Our Journey</h2>
              <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                Whether you're taking your first steps in programming or looking to advance your AI expertise, 
                Planet 09 AI offers the resources, community, and structure to help you succeed. Join us as we 
                build the future of AI education together.
              </p>
              <Button 
                onClick={() => navigate("/register")} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg"
              >
                Begin Your AI Journey
              </Button>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© {new Date().getFullYear()} Planet 09 AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
