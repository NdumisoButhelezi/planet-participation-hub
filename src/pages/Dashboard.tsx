
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import UserAgreementDialog from "@/components/dashboard/UserAgreementDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import LearningPaths from "@/components/dashboard/LearningPaths";
import EventsSection from "@/components/dashboard/EventsSection";
import CurriculumSchedule from "@/components/dashboard/CurriculumSchedule";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [learningReflection, setLearningReflection] = useState("");
  const [peersEngaged, setPeersEngaged] = useState("0");
  const [events, setEvents] = useState<Event[]>([]);
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
      
      // Update user points for submission
      const newPoints = (user.points ?? 0) + 10; // +10 points for submission
      await updateDoc(doc(db, "users", user.id), {
        points: newPoints
      });
      
      setUser({ ...user, points: newPoints });
      
      toast({
        title: "Success",
        description: "Your reflection has been submitted for review (+10 points)",
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsData = eventsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Event[];
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
      }
    };

    fetchEvents();
  }, [toast]);

  const handleRegisterEvent = async (eventId: string) => {
    if (!user) return;
    
    toast({
      title: "Success",
      description: "You have registered for this event",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-12">
          <WelcomeSection user={user} />

          <CurriculumSchedule />

          <LearningPaths
            skillLevel={user.skillLevel}
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

          <EventsSection 
            events={events}
            onRegister={handleRegisterEvent}
          />
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
