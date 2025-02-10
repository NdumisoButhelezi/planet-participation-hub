
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Event, Perspective } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Plus, Edit, Trash, CheckCircle } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
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
      <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold text-blue-600">Planet 09 AI Events</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => {
                  resetForm();
                  setShowEventDialog(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => editEvent(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{event.targetGroup.join(", ")}</span>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Objectives:</p>
                  <p className="text-sm text-gray-600">{event.objectives}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Outcome:</p>
                  <p className="text-sm text-gray-600">{event.outcome}</p>
                </div>
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => handleRegister(event.id)}
                  >
                    Register for Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={perspective}
              onValueChange={(value) => setPerspective(value as Perspective)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select perspective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STEWARDSHIP">Stewardship</SelectItem>
                <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
                <SelectItem value="SOCIETY">Society</SelectItem>
                <SelectItem value="SYSTEMS AND PROCESSES">Systems and Processes</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Group</label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={targetGroup.includes("Student")}
                    onCheckedChange={(checked) => {
                      setTargetGroup(prev => 
                        checked 
                          ? [...prev, "Student"]
                          : prev.filter(g => g !== "Student")
                      );
                    }}
                  />
                  <span>Student</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={targetGroup.includes("Staff")}
                    onCheckedChange={(checked) => {
                      setTargetGroup(prev => 
                        checked 
                          ? [...prev, "Staff"]
                          : prev.filter(g => g !== "Staff")
                      );
                    }}
                  />
                  <span>Staff</span>
                </div>
              </div>
            </div>

            <Textarea
              placeholder="Objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
            />

            <Textarea
              placeholder="Outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Perspective Weighting"
              value={perspectiveWeighting}
              onChange={(e) => setPerspectiveWeighting(e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEventSubmit}>
              {selectedEvent ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
