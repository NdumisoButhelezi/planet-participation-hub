
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Event } from "@/types/events";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AdminActionsProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const AdminActions = ({ event, onEdit, onDelete }: AdminActionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        onClick={() => setShowDeleteConfirm(true)}
        className="hover:bg-red-50"
      >
        <Trash className="h-4 w-4 text-red-600" />
      </Button>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(event.id);
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminActions;
