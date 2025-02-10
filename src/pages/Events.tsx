
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
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userDoc = await getDocs(collection(db, "users"));
      const currentUserData = userDoc.docs.find(doc => doc.id === user.uid);
      setIsAdmin(!!currentUserData?.data()?.isAdmin);

      loadEvents();
    };

    checkAuth();
  }, [navigate]);

  const loadEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  const handleEventSubmit = async () => {
    try {
      const eventData: Omit<Event, "id"> = {
        perspective,
        name,
        date,
        targetGroup,
        objectives,
        outcome,
        perspectiveWeighting: Number(perspectiveWeighting),
      };

      if (selectedEvent) {
        await updateDoc(doc(db, "events", selectedEvent.id), eventData);
      } else {
        await addDoc(collection(db, "events"), eventData);
      }

      setShowEventDialog(false);
      loadEvents();
      resetForm();
      
      toast({
        title: "Success",
        description: selectedEvent ? "Event updated" : "Event created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      loadEvents();
      toast({
        title: "Success",
        description: "Event deleted",
      });
    } catch (error) {
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
