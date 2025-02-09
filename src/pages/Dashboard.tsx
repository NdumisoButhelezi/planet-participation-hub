
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { User, PLAYLISTS, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Play, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [learningReflection, setLearningReflection] = useState("");
  const [peersEngaged, setPeersEngaged] = useState("0");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          if (!userData.hasAcceptedAgreement && !userData.isAdmin) {
            setShowAgreement(true);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  const handleAcceptAgreement = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        hasAcceptedAgreement: true,
        progress: 0,
      });
      
      setShowAgreement(false);
      setUser({ ...user, hasAcceptedAgreement: true, progress: 0 });
      
      toast({
        title: "Welcome aboard!",
        description: "You've successfully joined Planet 09 AI program.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept agreement",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReflection = async (playlistUrl: string) => {
    if (!user || !learningReflection.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const submission: Omit<Submission, "id"> = {
        userId: user.id,
        taskId: playlistUrl,
        content: learningReflection,
        projectLink,
        socialMediaLink,
        learningReflection,
        peersEngaged: parseInt(peersEngaged),
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "submissions"), submission);
      
      toast({
        title: "Success",
        description: "Your reflection has been submitted for review",
      });
      
      setProjectLink("");
      setSocialMediaLink("");
      setLearningReflection("");
      setPeersEngaged("0");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reflection",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const userPlaylists = PLAYLISTS[user.skillLevel];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold text-blue-600">Planet 09 AI</div>
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Button>
            )}
            <Button variant="ghost" onClick={() => auth.signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
            <p className="text-gray-600 mt-2">
              Your current skill level: {user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1)}
            </p>
            {!user.isAdmin && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Program Progress</p>
                <Progress value={user.progress || 0} className="w-full" />
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPlaylists.map((playlistUrl, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-semibold">
                    Learning Path {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={`${playlistUrl.replace('playlist?list=', 'embed/videoseries?list=')}`}
                      title={`Learning Path ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Play className="h-5 w-5" />
                    <span>Watch Videos</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Track Progress</span>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Project GitHub/Drive Link"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                    />
                    
                    <Input
                      placeholder="Social Media Post Link"
                      value={socialMediaLink}
                      onChange={(e) => setSocialMediaLink(e.target.value)}
                    />
                    
                    <Input
                      type="number"
                      placeholder="Number of peers engaged with"
                      value={peersEngaged}
                      onChange={(e) => setPeersEngaged(e.target.value)}
                      min="0"
                    />

                    <Textarea
                      placeholder="Write your reflection about what you learned..."
                      value={learningReflection}
                      onChange={(e) => setLearningReflection(e.target.value)}
                      className="min-h-[100px]"
                    />

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSubmitReflection(playlistUrl)}
                    >
                      Submit Reflection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Planet 09 AI Participation Agreement</DialogTitle>
            <DialogDescription>
              <div className="prose prose-sm mt-4">
                <h2>📅 Program Duration: March 2025 – April 2025</h2>
                <p className="font-medium">🎯 Goal: Enhance students' employability through hands-on projects, workshops, hackathons, and expert guest sessions.</p>
                
                <h3>🔹 Participant Commitments</h3>
                <h4>1. Active Project Participation</h4>
                <ul>
                  <li>Complete at least one (1) project within the 8-week period</li>
                  <li>Document the project's progress and final outcome</li>
                  <li>Create a short video (1–3 minutes) showcasing the project</li>
                  <li>Post on social media using #Planet09AI</li>
                </ul>

                <h4>2. Progress Tracking (Weekly Updates Required)</h4>
                <ul>
                  <li>Submit project status (GitHub/Drive link)</li>
                  <li>Share social media post link</li>
                  <li>Write reflection on learning</li>
                </ul>

                <h4>3. Community Engagement</h4>
                <ul>
                  <li>Comment on two other participants' posts weekly</li>
                  <li>Attend one hackathon/workshop/session</li>
                  <li>Participate in peer reviews</li>
                </ul>

                <h3>🔹 Program Compliance</h3>
                <ul>
                  <li>Missing two weeks of updates = removal</li>
                  <li>No social media = no certification</li>
                  <li>Top performers get exclusive opportunities</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleAcceptAgreement} className="w-full mt-4">
              I Accept the Agreement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
