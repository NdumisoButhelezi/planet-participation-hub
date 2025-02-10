
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { User, PLAYLISTS, Submission } from "@/types/user";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import UserAgreementDialog from "@/components/dashboard/UserAgreementDialog";
import LearningPathCard from "@/components/dashboard/LearningPathCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

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
      <DashboardHeader user={user} />

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
              <LearningPathCard
                key={index}
                index={index}
                playlistUrl={playlistUrl}
                projectLink={projectLink}
                socialMediaLink={socialMediaLink}
                peersEngaged={peersEngaged}
                learningReflection={learningReflection}
                onProjectLinkChange={setProjectLink}
                onSocialMediaLinkChange={setSocialMediaLink}
                onPeersEngagedChange={setPeersEngaged}
                onLearningReflectionChange={setLearningReflection}
                onSubmitReflection={handleSubmitReflection}
              />
            ))}
          </div>
        </div>
      </main>

      <UserAgreementDialog
        open={showAgreement}
        onOpenChange={setShowAgreement}
        onAccept={handleAcceptAgreement}
      />
    </div>
  );
};

export default Dashboard;
