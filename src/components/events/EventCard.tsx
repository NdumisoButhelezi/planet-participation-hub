
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Edit, Trash } from "lucide-react";

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onRegister: (eventId: string) => void;
}

const EventCard = ({ event, isAdmin, onEdit, onDelete, onRegister }: EventCardProps) => {
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(event.id)}
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
            onClick={() => onRegister(event.id)}
          >
            Register for Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
