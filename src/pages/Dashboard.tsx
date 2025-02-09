
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { User, PLAYLISTS, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reflection, setReflection] = useState("");
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
          setUser({ id: userDoc.id, ...userDoc.data() } as User);
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

  const handleSubmitReflection = async (playlistUrl: string) => {
    if (!user || !reflection.trim()) {
      toast({
        title: "Error",
        description: "Please write your reflection before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const submission: Omit<Submission, "id"> = {
        userId: user.id,
        taskId: playlistUrl,
        content: reflection,
        status: "pending",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "submissions"), submission);
      
      toast({
        title: "Success",
        description: "Your reflection has been submitted for review",
      });
      
      setReflection("");
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

                  <Textarea
                    placeholder="Write your reflection about what you learned from these videos..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSubmitReflection(playlistUrl)}
                  >
                    Submit Reflection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
