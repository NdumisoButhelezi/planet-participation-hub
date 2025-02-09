
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User, PLAYLISTS } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
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
          <div className="text-xl font-semibold">Planet 09 AI</div>
          <Button variant="ghost" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
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
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Play className="h-5 w-5" />
                    <span>Video Content</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Track Progress</span>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(playlistUrl, '_blank')}
                  >
                    Start Learning
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
