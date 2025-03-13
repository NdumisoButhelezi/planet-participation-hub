
import { Event } from "@/types/events";
import EventCard from "../events/EventCard";

interface EventsSectionProps {
  events: Event[];
  onRegister: (eventId: string) => void;
}

const EventsSection = ({ events, onRegister }: EventsSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
      
      {events.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No upcoming events at the moment.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default EventsSection;
