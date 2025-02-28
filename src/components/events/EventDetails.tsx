
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventDetailsProps {
  date: string;
  targetGroup: string[];
  objectives: string;
  outcome: string;
  onRegister: () => void;
}

const EventDetails = ({ date, targetGroup, objectives, outcome, onRegister }: EventDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Calendar className="h-4 w-4" />
        <span>{date}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="h-4 w-4" />
        <span>{targetGroup.join(", ")}</span>
      </div>
      <div className="space-y-2">
        <p className="font-medium text-gray-700">Objectives:</p>
        <p className="text-sm text-gray-600">{objectives}</p>
      </div>
      <div className="space-y-2">
        <p className="font-medium text-gray-700">Outcome:</p>
        <p className="text-sm text-gray-600">{outcome}</p>
      </div>
      <div className="pt-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={onRegister}
        >
          Register for Event
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
