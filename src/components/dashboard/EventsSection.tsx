
import { Event } from "@/types/events";
import EventCard from "../events/EventCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import EventRegistrationForm from "../events/EventRegistrationForm";
import { useToast } from "@/hooks/use-toast";

interface EventsSectionProps {
  events: Event[];
  onRegister: (eventId: string) => void;
}

const EventsSection = ({ events, onRegister }: EventsSectionProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const handleRegisterClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    onRegister(selectedEventId);
    toast({
      title: "Registration Submitted",
      description: "Your registration has been submitted for review. If approved, you'll earn 100 points!",
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md ice-border">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Upcoming Events</h2>
      
      {events.length === 0 ? (
        <div className="p-4 sm:p-8 text-center">
          <p className="text-gray-500">No upcoming events at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={false}
              onEdit={() => {}}
              onDelete={() => {}}
              onRegister={() => handleRegisterClick(event.id)}
            />
          ))}
        </div>
      )}

      {showRegistrationForm && (
        <EventRegistrationForm
          open={showRegistrationForm}
          onOpenChange={setShowRegistrationForm}
          eventId={selectedEventId}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default EventsSection;
