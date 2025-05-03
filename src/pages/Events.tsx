
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Event, Perspective } from "@/types/events";
import { useToast } from "@/hooks/use-toast";
import EventsHeader from "@/components/events/EventsHeader";
import EventCard from "@/components/events/EventCard";
import EventForm from "@/components/events/EventForm";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [perspective, setPerspective] = useState<Perspective>("STEWARDSHIP");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [targetGroup, setTargetGroup] = useState<("Student" | "Staff")[]>([]);
  const [objectives, setObjectives] = useState("");
  const [outcome, setOutcome] = useState("");
  const [perspectiveWeighting, setPerspectiveWeighting] = useState("0");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Check if user is admin
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(query(usersRef));
        const currentUserData = userSnapshot.docs.find(doc => doc.id === user.uid);
        
        if (currentUserData) {
          const isAdmin = !!currentUserData.data()?.isAdmin;
          setIsAdmin(isAdmin);
          console.log("User is admin:", isAdmin);
        }

        await loadEvents();
      } catch (error) {
        console.error("Error checking auth:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const loadEvents = async () => {
    try {
      console.log("Loading events...");
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      console.log("Events loaded:", eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  const handleEventSubmit = async () => {
    try {
      if (!name || !date || targetGroup.length === 0 || !objectives || !outcome) {
        toast({
          title: "Missing fields",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }

      const eventData: Omit<Event, "id"> = {
        perspective,
        name,
        date,
        targetGroup,
        objectives,
        outcome,
        perspectiveWeighting: Number(perspectiveWeighting),
      };

      console.log("Submitting event:", eventData);

      if (selectedEvent) {
        await updateDoc(doc(db, "events", selectedEvent.id), eventData);
        console.log("Event updated:", selectedEvent.id);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        const docRef = await addDoc(collection(db, "events"), eventData);
        console.log("Event created with ID:", docRef.id);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      setShowEventDialog(false);
      resetForm();
      await loadEvents();
      
    } catch (error) {
      console.error("Failed to save event:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
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
      
      await loadEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      await addDoc(collection(db, "eventRegistrations"), {
        eventId,
        userId: user.uid,
        status: "pending",
        createdAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Registration submitted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setPerspective("STEWARDSHIP");
    setName("");
    setDate("");
    setTargetGroup([]);
    setObjectives("");
    setOutcome("");
    setPerspectiveWeighting("0");
    setSelectedEvent(null);
  };

  const editEvent = (event: Event) => {
    setSelectedEvent(event);
    setPerspective(event.perspective);
    setName(event.name);
    setDate(event.date);
    setTargetGroup(event.targetGroup);
    setObjectives(event.objectives);
    setOutcome(event.outcome);
    setPerspectiveWeighting(event.perspectiveWeighting.toString());
    setShowEventDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <EventsHeader 
        isAdmin={isAdmin} 
        onNewEvent={() => {
          resetForm();
          setShowEventDialog(true);
        }} 
      />

      <main className="container mx-auto px-6 py-8">
        {events.length === 0 ? (
          <div className="text-center p-8 bg-white/50 rounded-lg shadow-sm">
            <p className="text-gray-600">No events found. {isAdmin && "Create a new event to get started."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                onEdit={editEvent}
                onDelete={handleDeleteEvent}
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}
      </main>

      <EventForm
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
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

export default Events;
