import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Code, 
  Github, 
  Globe, 
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const ChallengeSection = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Github, text: "GitHub & Vite setup" },
    { icon: Globe, text: "Build your own Portfolio (step by step)" },
    { icon: Code, text: "HTML, CSS, & JavaScript mastery" },
    { icon: TrendingUp, text: "Firebase integration & live projects" },
    { icon: CheckCircle2, text: "Weekly challenges + deadlines to keep you on track" },
    { icon: Trophy, text: "Leaderboard + certificates" },
    { icon: Users, text: "24/7 Support + Mentors" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5">
      <div className="container mx-auto px-4">
        <div data-aos="fade-up" className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
            🌍💻 New Program Alert
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">
              Join the PlutoDev 8-Week Coding Challenge!
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Want to learn coding, build real projects, and level up your skills with a supportive community? 🎯
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Features List */}
          <div data-aos="fade-right" className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Here's what you'll get in just 8 weeks:
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-card-foreground font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Program Details Card */}
          <div data-aos="fade-left">
            <Card className="glass-card border-primary/20 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Program Timeline */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground">Program Runs</div>
                      <div className="text-muted-foreground">March – May 2025</div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="font-semibold text-foreground">Weekly Tasks</div>
                      <div className="text-sm text-muted-foreground">Progress Tracking</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <Trophy className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
                      <div className="font-semibold text-foreground">Compete & Learn</div>
                      <div className="text-sm text-muted-foreground">Showcase Talent</div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="font-semibold text-foreground mb-2">
                        👉 Whether you're a beginner or looking to grow, this program is for YOU.
                      </div>
                      <div className="text-primary font-medium">
                        💡 Ready to start your journey?
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => navigate("/register")}
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      Join the Challenge Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengeSection;