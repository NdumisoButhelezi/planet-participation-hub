
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event, Perspective } from "@/types/events";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import EventForm from "@/components/events/EventForm";
import EventCard from "@/components/events/EventCard";
import EventRegistrationsView from "@/components/admin/EventRegistrationsView";
import UsersManagement from "@/components/admin/UsersManagement";
import SubmissionsManagement from "@/components/admin/SubmissionsManagement";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'users' | 'events' | 'submissions' | 'registrations'>('users');
  const [isLoading, setIsLoading] = useState(true);
  
  const [perspective, setPerspective] = useState<Perspective>("STEWARDSHIP");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [targetGroup, setTargetGroup] = useState<("Student" | "Staff")[]>([]);
  const [objectives, setObjectives] = useState("");
  const [outcome, setOutcome] = useState("");
  const [perspectiveWeighting, setPerspectiveWeighting] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", user.uid)));
        const currentUserData = userDoc.docs[0]?.data();
        
        if (!currentUserData?.isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        // Set up real-time listeners for users and submissions
        const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
          setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
        });

        const submissionsUnsubscribe = onSnapshot(collection(db, "submissions"), (snapshot) => {
          setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
        });

        const eventsUnsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
          setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
        });

        setIsLoading(false);

        return () => {
          usersUnsubscribe();
          submissionsUnsubscribe();
          eventsUnsubscribe();
        };
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin access",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  const resetEventForm = () => {
    setSelectedEvent(null);
    setPerspective("STEWARDSHIP");
    setName("");
    setDate("");
    setTargetGroup([]);
    setObjectives("");
    setOutcome("");
    setPerspectiveWeighting("");
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    switch (currentView) {
      case 'users':
        return <UsersManagement users={users} onUserUpdate={setUsers} />;
      
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAdmin={true}
                  onEdit={() => {
                    setSelectedEvent(event);
                    setPerspective(event.perspective);
                    setName(event.name);
                    setDate(event.date);
                    setTargetGroup(event.targetGroup);
                    setObjectives(event.objectives);
                    setOutcome(event.outcome);
                    setPerspectiveWeighting(event.perspectiveWeighting.toString());
                    setShowEventForm(true);
                  }}
                  onDelete={() => {}}
                  onRegister={() => {}}
                />
              ))}
            </div>
          </div>
        );

      case 'registrations':
        return <EventRegistrationsView />;

      case 'submissions':
        return (
          <SubmissionsManagement 
            submissions={submissions} 
            users={users} 
            onSubmissionUpdate={setSubmissions}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-semibold text-blue-600">
                PLANET 09 AI WRITING
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          <AdminNavigation 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {renderContent()}
        </div>
      </main>

      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        selectedEvent={selectedEvent}
        onSubmit={async () => {}}
        perspective={perspective}
        setPerspective={setPerspective}
        name={name}
        setName={setName}
        date={date}
        setDate={setDate}
        targetGroup={targetGroup}
        setTargetGroup={setTargetGroup}
        objectives={objectives}
        setObjectives={setObjectives}
        outcome={outcome}
        setOutcome={setOutcome}
        perspectiveWeighting={perspectiveWeighting}
        setPerspectiveWeighting={setPerspectiveWeighting}
      />
    </div>
  );
};

export default Admin;
