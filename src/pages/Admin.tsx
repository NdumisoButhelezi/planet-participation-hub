import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Event, Perspective } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Shield, Plus, Home, Users, Calendar, FileText } from "lucide-react";
import EventForm from "@/components/events/EventForm";
import EventCard from "@/components/events/EventCard";
import EventRegistrationsView from "@/components/admin/EventRegistrationsView";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'users' | 'events' | 'submissions' | 'registrations'>('users');
  
  // Event form state
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
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userDoc = await getDocs(collection(db, "users"));
      const currentUserData = userDoc.docs.find(doc => doc.id === user.uid);
      
      if (!currentUserData?.data()?.isAdmin) {
        navigate("/dashboard");
        return;
      }

      const usersSnapshot = await getDocs(collection(db, "users"));
      const submissionsSnapshot = await getDocs(collection(db, "submissions"));
      
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      setSubmissions(submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
    };

    checkAdmin();
  }, [navigate]);

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
      }
    };

    fetchEvents();
  }, []);

  const makeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isAdmin: true
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: true } : user
      ));
      
      toast({
        title: "Success",
        description: "User has been made admin",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleSubmission = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      const submission = submissions.find(sub => sub.id === submissionId);
      if (!submission) return;

      const userRef = doc(db, "users", submission.userId);
      const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", submission.userId)));
      const userData = userDoc.docs[0].data() as User;
      
      let pointsChange = 0;
      if (status === "approved") {
        // +10 for weekly reflection, +30 for approval
        pointsChange = 40;
      } else {
        // -20 for rejection
        pointsChange = -20;
      }

      // Update user points
      await updateDoc(userRef, {
        points: (userData.points || 0) + pointsChange
      });

      // Update submission status
      await updateDoc(doc(db, "submissions", submissionId), {
        status
      });
      
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status } : sub
      ));
      
      toast({
        title: "Success",
        description: `Submission ${status} and points updated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      const newEvent = {
        perspective,
        name,
        date,
        targetGroup,
        objectives,
        outcome,
        perspectiveWeighting: parseInt(perspectiveWeighting),
      };

      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents([...events, { id: docRef.id, ...newEvent }]);
      setShowEventForm(false);
      resetEventForm();
      
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setPerspective(event.perspective);
    setName(event.name);
    setDate(event.date);
    setTargetGroup(event.targetGroup);
    setObjectives(event.objectives);
    setOutcome(event.outcome);
    setPerspectiveWeighting(event.perspectiveWeighting.toString());
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter(event => event.id !== eventId));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

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
    switch (currentView) {
      case 'users':
        return (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        {user.skillLevel} • {user.isAdmin ? "Admin" : "User"}
                      </p>
                    </div>
                    {!user.isAdmin && (
                      <Button 
                        variant="outline"
                        onClick={() => makeAdmin(user.id)}
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Make Admin
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      case 'events':
        return (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isAdmin={true}
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event.id)}
                    onRegister={() => {}}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'registrations':
        return <EventRegistrationsView />;

      case 'submissions':
        return (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map(submission => (
                  <div key={submission.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          User: {users.find(u => u.id === submission.userId)?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Project Link: <a href={submission.projectLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{submission.projectLink}</a>
                        </p>
                        <p className="text-sm text-gray-600">
                          Social Media: <a href={submission.socialMediaLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{submission.socialMediaLink}</a>
                        </p>
                        <p className="text-sm text-gray-600">
                          Peers Engaged: {submission.peersEngaged}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        submission.status === "approved" ? "bg-green-100 text-green-800" :
                        submission.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                    
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-800">{submission.learningReflection}</p>
                    </div>

                    {submission.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleSubmission(submission.id, "approved")}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleSubmission(submission.id, "rejected")}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto">
          {/* Top Navigation Bar */}
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
          
          {/* Secondary Navigation */}
          <div className="flex items-center gap-6 px-6 py-2">
            <Button
              variant={currentView === 'users' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('users')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button
              variant={currentView === 'events' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('events')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Events
            </Button>
            <Button
              variant={currentView === 'registrations' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('registrations')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Event Registrations
            </Button>
            <Button
              variant={currentView === 'submissions' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('submissions')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Submissions
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {currentView === 'events' && (
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Button>
            </div>
          )}
          {renderContent()}
        </div>
      </main>

      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        selectedEvent={selectedEvent}
        onSubmit={handleCreateEvent}
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
