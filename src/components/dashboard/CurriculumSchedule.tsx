import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, XCircle, Clock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, query, where, getDocs, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { User, Submission } from "@/types/user";

interface WeeklyTask {
  week: number;
  dates: string;
  title: string;
  tasks: string[];
  videoUrl?: string;
  videoTitle?: string;
}

const curriculumData: WeeklyTask[] = [
  {
    week: 1,
    dates: "March 3 - March 9",
    title: "GitHub & Vite Setup",
    tasks: [
      "Set up GitHub & LinkedIn profiles",
      "Learn Vite basics (https://vite.dev/)",
      "Basic introduction to HTML, CSS, JS/TS with Vite"
    ],
    videoUrl: "https://www.youtube.com/embed/L-Wfo-J5lso?si=Lu0h7bhZenlimP9E",
    videoTitle: "Week 1 - Part 1: Setting Up Vite, HTML, CSS & JS/TS + GitHub & LinkedIn Profiles"
  },
  {
    week: 2,
    dates: "March 10 - March 16",
    title: "Basic Portfolio Structure",
    tasks: [
      "Create a simple homepage layout",
      "Understand HTML structure & semantic elements",
      "Add a basic navigation bar & footer"
    ],
    videoUrl: "https://www.youtube.com/embed/bQK22OcurIg",
    videoTitle: "Week 2: Creating Basic Portfolio Structure"
  },
  {
    week: 3,
    dates: "March 17 - March 23",
    title: "Styling with CSS",
    tasks: [
      "Learn CSS fundamentals (Flexbox, Grid)",
      "Create responsive layouts",
      "Use CSS animations & transitions"
    ]
  },
  {
    week: 4,
    dates: "March 24 - March 30",
    title: "JavaScript Interactivity",
    tasks: [
      "Add dynamic content with JavaScript",
      "Implement form validation",
      "Create basic event-driven UI interactions"
    ]
  },
  {
    week: 5,
    dates: "March 31 - April 6",
    title: "Advanced Portfolio Features",
    tasks: [
      "Integrate contact form with Firebase",
      "Add light/dark mode toggle",
      "Work on smooth scrolling & UX enhancements"
    ]
  },
  {
    week: 6,
    dates: "April 7 - April 13",
    title: "Project Showcase",
    tasks: [
      "Display past projects & skills",
      "Implement a filterable projects section",
      "Fetch & display GitHub repositories dynamically"
    ]
  },
  {
    week: 7,
    dates: "April 14 - April 20",
    title: "Deployment & Optimization",
    tasks: [
      "Host the site on Vercel/Netlify",
      "Optimize for performance & SEO",
      "Use Lighthouse for auditing"
    ]
  },
  {
    week: 8,
    dates: "April 21 - April 27",
    title: "Final Submission & Reflection",
    tasks: [
      "Submit final portfolio link",
      "Write a reflection on progress & lessons learned",
      "Admin review & leaderboard ranking"
    ]
  }
];

const CurriculumSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [peersEngaged, setPeersEngaged] = useState("0");
  const [learningReflection, setLearningReflection] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showVideoMap, setShowVideoMap] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const fetchUser = async () => {
      const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", userId)));
      if (!userDoc.empty) {
        setCurrentUser({ id: userId, ...userDoc.docs[0].data() } as User);
      }
    };
    fetchUser();

    const q = query(collection(db, "submissions"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Submission[];
      setSubmissions(submissionsData);
    });

    return () => unsubscribe();
  }, []);

  const toggleVideoPreview = (weekNum: number) => {
    setShowVideoMap(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const handleSubmitReflection = async () => {
    if (!learningReflection.trim() || !selectedWeek) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Not authenticated");

      const userRef = doc(db, "users", userId);
      const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", userId)));
      const userData = userDoc.docs[0].data() as User;

      await updateDoc(userRef, {
        points: (userData.points || 0) + 10
      });

      await addDoc(collection(db, "submissions"), {
        userId,
        taskId: `week-${selectedWeek}`,
        content: learningReflection,
        projectLink,
        socialMediaLink,
        peersEngaged: parseInt(peersEngaged),
        status: "pending",
        createdAt: new Date(),
        learningReflection
      });

      toast({
        title: "Success",
        description: `Week ${selectedWeek} reflection submitted successfully! (+10 points)`,
      });

      setProjectLink("");
      setSocialMediaLink("");
      setPeersEngaged("0");
      setLearningReflection("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting reflection:", error);
      toast({
        title: "Error",
        description: "Failed to submit reflection",
        variant: "destructive",
      });
    }
  };

  const getSubmissionStatus = (week: number) => {
    const submission = submissions.find(s => s.taskId === `week-${week}`);
    if (!submission) return null;
    return submission.status;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <CalendarDays className="h-6 w-6 text-blue-500" />
            Program Schedule (March - April 2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {curriculumData.map((week) => {
              const status = getSubmissionStatus(week.week);
              
              return (
                <div key={week.week} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <span className="flex items-center gap-2">
                          Week {week.week}: {week.title}
                          {getStatusIcon(status)}
                        </span>
                        <span className="text-sm text-gray-500">{week.dates}</span>
                      </h3>
                      <ul className="mt-2 space-y-1 text-left list-disc list-inside">
                        {week.tasks.map((task, index) => (
                          <li key={index} className="text-gray-600 text-sm pl-0">
                            {task}
                          </li>
                        ))}
                      </ul>
                      
                      {week.videoUrl && (
                        <>
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              className="w-full md:w-auto flex items-center justify-center gap-2 mb-3"
                              onClick={() => toggleVideoPreview(week.week)}
                            >
                              {showVideoMap[week.week] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              {showVideoMap[week.week] ? "Hide Video" : "Show Video"}
                            </Button>
                            
                            {showVideoMap[week.week] && (
                              <div className="mt-2">
                                <h4 className="text-blue-600 font-medium mb-3">{week.videoTitle}</h4>
                                <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden bg-gray-100 animate-fade-in">
                                  <iframe
                                    src={week.videoUrl}
                                    className="absolute top-0 left-0 w-full h-full"
                                    title={week.videoTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      
                      {status && (
                        <p className={`mt-2 text-sm font-medium ${getStatusColor(status)}`}>
                          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full md:w-auto shrink-0"
                      onClick={() => {
                        setSelectedWeek(week.week);
                        setIsDialogOpen(true);
                      }}
                      disabled={status === "approved"}
                    >
                      {status === "approved" ? "Completed" : "Submit Reflection"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw]' : 'sm:max-w-[500px]'} p-4 md:p-6`}>
          <DialogHeader>
            <DialogTitle>Submit Week {selectedWeek} Reflection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                placeholder="Project GitHub/Drive Link"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Social Media Post Link"
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Number of peers engaged with"
                value={peersEngaged}
                onChange={(e) => setPeersEngaged(e.target.value)}
                min="0"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your reflection about what you learned..."
                value={learningReflection}
                onChange={(e) => setLearningReflection(e.target.value)}
                className="min-h-[150px] w-full"
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmitReflection}
            >
              Submit Reflection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CurriculumSchedule;
