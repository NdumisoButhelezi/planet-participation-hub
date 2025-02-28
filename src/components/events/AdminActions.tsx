
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Event } from "@/types/events";

interface AdminActionsProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const AdminActions = ({ event, onEdit, onDelete }: AdminActionsProps) => {
  return (
    <>
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
    </>
  );
};

export default AdminActions;
