import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, query, where, Timestamp, onSnapshot } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import UserAgreementDialog from "@/components/dashboard/UserAgreementDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import LearningPaths from "@/components/dashboard/LearningPaths";
import EventsSection from "@/components/dashboard/EventsSection";
import CurriculumSchedule from "@/components/dashboard/CurriculumSchedule";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import { calculateProgramSchedule } from "@/utils/dateUtils";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeSection, setActiveSection] = useState("weekly-program");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  const [projectLink, setProjectLink] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [peersEngaged, setPeersEngaged] = useState("");
  const [learningReflection, setLearningReflection] = useState("");

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
          
          if (!userData.registrationDate) {
            const registrationDate = new Date();
            await updateDoc(doc(db, "users", userData.id), {
              registrationDate: Timestamp.fromDate(registrationDate)
            });
            userData.registrationDate = registrationDate;
          } else if (userData.registrationDate instanceof Timestamp) {
            userData.registrationDate = userData.registrationDate.toDate();
          }
          
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

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const submissionsQuery = query(collection(db, "submissions"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Submission[];
      
      setSubmissions(submissionsData);
      
      if (user) {
        const completedWeeks = submissionsData.filter(sub => 
          sub.status === "approved" && sub.taskId.startsWith("week-")
        ).length;
        
        const newProgress = Math.min(Math.round((completedWeeks / 8) * 100), 100);
        
        if (newProgress !== user.progress) {
          updateDoc(doc(db, "users", user.id), {
            progress: newProgress
          });
          
          setUser(prev => prev ? { ...prev, progress: newProgress } : null);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptAgreement = async () => {
    if (!user) return;
    
    try {
      const registrationDate = new Date();
      
      await updateDoc(doc(db, "users", user.id), {
        hasAcceptedAgreement: true,
        progress: 0,
        registrationDate: Timestamp.fromDate(registrationDate)
      });
      
      setShowAgreement(false);
      setUser({ 
        ...user, 
        hasAcceptedAgreement: true, 
        progress: 0,
        registrationDate 
      });
      
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
    if (!user) return;

    try {
      const submission: Omit<Submission, "id" | "createdAt"> = {
        userId: user.id,
        taskId: playlistUrl,
        content: "",
        projectLink,
        socialMediaLink,
        learningReflection,
        peersEngaged: Number(peersEngaged),
        status: "pending"
      };

      const submissionRef = await addDoc(collection(db, "submissions"), {
        ...submission,
        createdAt: new Date()
      });

      const points = playlistUrl.includes("playlist") ? 30 : 50;
      await updateDoc(doc(db, "users", user.id), {
        points: (user.points || 0) + points
      });

      setUser(prev => prev ? { ...prev, points: (prev.points || 0) + points } : null);

      setProjectLink("");
      setSocialMediaLink("");
      setPeersEngaged("");
      setLearningReflection("");

      toast({
        title: "Success",
        description: `Submission successful! (+${points} points)`,
      });

      const leaderboardQuery = query(collection(db, "users"), where("points", ">", 0));
      await getDocs(leaderboardQuery);

    } catch (error) {
      console.error("Error submitting reflection:", error);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const programSchedule = user.registrationDate 
    ? calculateProgramSchedule(user.registrationDate) 
    : null;

  const renderActiveSection = () => {
    switch (activeSection) {
      case "weekly-program":
        return <CurriculumSchedule programSchedule={programSchedule} />;
      case "learning-paths":
        return (
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
        );
      case "events":
        return (
          <EventsSection 
            events={events}
            onRegister={async () => {
              toast({
                title: "Success",
                description: "You have registered for this event",
              });
            }}
          />
        );
      default:
        return <CurriculumSchedule programSchedule={programSchedule} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-6 py-8">
        <WelcomeSection user={user} />
        
        {programSchedule && (
          <div className="mt-6">
            <ProgressTracker 
              schedule={programSchedule} 
              submissions={submissions.filter(sub => sub.taskId.startsWith("week-"))}
            />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row mt-8 space-y-6 md:space-y-0 md:gap-6">
          <DashboardSidebar 
            activeSection={activeSection} 
            onChangeSection={setActiveSection} 
          />
          
          <div className="flex-1 transition-all duration-300 animate-fade-in">
            {renderActiveSection()}
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
