
import { Event } from "@/types/events";
import EventCard from "../events/EventCard";

interface EventsSectionProps {
  events: Event[];
  onRegister: (eventId: string) => void;
}

const EventsSection = ({ events, onRegister }: EventsSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={false}
            onEdit={() => {}}
            onDelete={() => {}}
            onRegister={onRegister}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
