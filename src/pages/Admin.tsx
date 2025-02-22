
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event, Perspective } from "@/types/events";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Shield } from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
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
        setIsLoading(false);
        setIsAdmin(false);
        navigate("/login");
        return;
      }

      try {
        // Check admin status
        const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", user.uid)));
        const currentUserData = userDoc.docs[0]?.data();
        setIsAdmin(!!currentUserData?.isAdmin);

        if (currentUserData?.isAdmin) {
          // Set up real-time listeners only if user is admin
          const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as User[];
            setUsers(usersData);
          });

          const submissionsUnsubscribe = onSnapshot(collection(db, "submissions"), (snapshot) => {
            const submissionsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Submission[];
            setSubmissions(submissionsData);
          });

          const eventsUnsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Event[];
            setEvents(eventsData);
          });

          setIsLoading(false);

          return () => {
            usersUnsubscribe();
            submissionsUnsubscribe();
            eventsUnsubscribe();
          };
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        toast({
          title: "Error",
          description: "Failed to verify admin access",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
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

  // Add the renderContent function here before it's used
  const renderContent = () => {
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

      case 'submissions':
        return (
          <SubmissionsManagement 
            submissions={submissions} 
            users={users} 
            onSubmissionUpdate={setSubmissions}
          />
        );

      case 'registrations':
        return <EventRegistrationsView />;

      default:
        return <div>Select a view</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
