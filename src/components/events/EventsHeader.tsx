
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventsHeaderProps {
  isAdmin: boolean;
  onNewEvent: () => void;
}

const EventsHeader = ({ isAdmin, onNewEvent }: EventsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-blue-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold pluto-gradient-text">PlutoDev Events</div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          {isAdmin && (
            <Button 
              onClick={onNewEvent}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white frost-slide"
            >
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default EventsHeader;
