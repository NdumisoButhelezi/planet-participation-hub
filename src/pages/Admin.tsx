import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event, Perspective } from "@/types/events";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Shield } from "lucide-react";
import EventForm from "@/components/events/EventForm";
import EventCard from "@/components/events/EventCard";
import EventRegistrationsView from "@/components/admin/EventRegistrationsView";
import UsersManagement from "@/components/admin/UsersManagement";
import SubmissionsManagement from "@/components/admin/SubmissionsManagement";
import UserAnalytics from "@/components/admin/UserAnalytics";
import AdminNavigation from "@/components/admin/AdminNavigation";
import QRScanner from "@/components/admin/QRScanner";
import PointsAudit from "@/components/admin/PointsAudit";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { responsiveClasses } from "@/utils/responsiveUtils";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'users' | 'events' | 'submissions' | 'registrations' | 'analytics' | 'verification' | 'points-audit'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [perspective, setPerspective] = useState<Perspective>("STEWARDSHIP");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [targetGroup, setTargetGroup] = useState<("Student" | "Staff")[]>([]);
  const [objectives, setObjectives] = useState("");
  const [outcome, setOutcome] = useState("");
  const [perspectiveWeighting, setPerspectiveWeighting] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleEventSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Form validation
      if (!name || !date || targetGroup.length === 0 || !objectives || !outcome) {
        toast({
          title: "Missing fields",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const eventData: Omit<Event, "id"> = {
        perspective,
        name,
        date,
        targetGroup,
        objectives,
        outcome,
        perspectiveWeighting: Number(perspectiveWeighting) || 0,
      };

      console.log("Submitting event:", eventData);

      if (selectedEvent) {
        // Update existing event
        await updateDoc(doc(db, "events", selectedEvent.id), eventData);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        // Create new event
        await addDoc(collection(db, "events"), eventData);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      setShowEventForm(false);
      resetEventForm();
      
    } catch (error) {
      console.error("Failed to save event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      console.log("Deleting event:", eventId);
      await deleteDoc(doc(db, "events", eventId));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'users':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <UsersManagement users={users} onUserUpdate={setUsers} />
          </div>
        );
      
      case 'events':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4 space-y-6">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => {
                  resetEventForm();
                  setShowEventForm(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size={isMobile ? "sm" : "default"}
              >
                <Plus className="h-4 w-4" />
                {!isMobile && "Create New Event"}
              </Button>
            </div>
            {events.length === 0 ? (
              <div className="text-center p-8 bg-white/50 rounded-lg">
                <p className="text-gray-600">No events available. Create your first event!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                    onDelete={handleDeleteEvent}
                    onRegister={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'submissions':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <SubmissionsManagement 
              submissions={submissions} 
              users={users} 
              onSubmissionUpdate={setSubmissions}
            />
          </div>
        );

      case 'registrations':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <EventRegistrationsView />
          </div>
        );
        
      case 'analytics':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <UserAnalytics users={users} submissions={submissions} />
          </div>
        );

      case 'verification':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <QRScanner />
          </div>
        );

      case 'points-audit':
        return (
          <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg ice-border p-4">
            <PointsAudit users={users} submissions={submissions} />
          </div>
        );

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
      <nav className={responsiveClasses(
        "w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10",
        "px-2", "px-4", "px-6"
      )}>
        <div className="container mx-auto">
          <div className={responsiveClasses(
            "flex justify-between items-center py-3 sm:py-4 border-b border-gray-100",
            "px-2", "px-4", "px-6"
          )}>
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/" className="text-lg sm:text-xl font-semibold text-blue-600">
                PLANET 09 AI WRITING
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
                size={isMobile ? "sm" : "default"}
              >
                <ArrowLeft className="h-4 w-4" />
                {!isMobile && "Back to Dashboard"}
              </Button>
            </div>
          </div>
          
          <AdminNavigation 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>
      </nav>

      <main className={responsiveClasses(
        "container mx-auto py-4 sm:py-8",
        "px-2", "px-4", "px-6"
      )}>
        <div className="space-y-4 sm:space-y-8">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>

      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        selectedEvent={selectedEvent}
        onSubmit={handleEventSubmit}
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
