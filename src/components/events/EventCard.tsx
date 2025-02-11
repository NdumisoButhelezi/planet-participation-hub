
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Edit, Trash } from "lucide-react";
import { useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onRegister: (eventId: string) => void;
}

const EventCard = ({ event, isAdmin, onEdit, onDelete, onRegister }: EventCardProps) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <>
      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
          {isAdmin && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(event)}
                className="hover:bg-blue-50"
              >
                <Edit className="h-4 w-4 text-blue-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(event.id)}
                className="hover:bg-red-50"
              >
                <Trash className="h-4 w-4 text-red-600" />
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
            <p className="font-medium text-gray-700">Objectives:</p>
            <p className="text-sm text-gray-600">{event.objectives}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Outcome:</p>
            <p className="text-sm text-gray-600">{event.outcome}</p>
          </div>
          <div className="pt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => setShowRegistrationForm(true)}
            >
              Register for Event
            </Button>
          </div>
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
