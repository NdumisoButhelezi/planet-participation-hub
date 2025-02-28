
import { Event } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import ShareEventPopover from "./ShareEventPopover";
import AdminActions from "./AdminActions";
import EventDetails from "./EventDetails";

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onRegister: (eventId: string) => void;
}

const EventCard = ({ event, isAdmin, onEdit, onDelete, onRegister }: EventCardProps) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegister = () => {
    setShowRegistrationForm(true);
  };

  return (
    <>
      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
          <div className="flex gap-2">
            <ShareEventPopover 
              eventId={event.id}
              eventName={event.name}
              eventDate={event.date}
              eventObjectives={event.objectives}
            />
            {isAdmin && (
              <AdminActions 
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <EventDetails 
            date={event.date}
            targetGroup={event.targetGroup}
            objectives={event.objectives}
            outcome={event.outcome}
            onRegister={handleRegister}
          />
        </CardContent>
      </Card>

      <EventRegistrationForm
        open={showRegistrationForm}
        onOpenChange={setShowRegistrationForm}
        eventId={event.id}
      />
    </>
  );
};

export default EventCard;
