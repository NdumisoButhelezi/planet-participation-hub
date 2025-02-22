
import { Button } from "@/components/ui/button";
import { Shield, Home, Users, Calendar, FileText } from "lucide-react";

interface AdminNavigationProps {
  currentView: 'users' | 'events' | 'submissions' | 'registrations';
  onViewChange: (view: 'users' | 'events' | 'submissions' | 'registrations') => void;
}

const AdminNavigation = ({ currentView, onViewChange }: AdminNavigationProps) => {
  return (
    <div className="flex items-center gap-6 px-6 py-2">
      <Button
        variant={currentView === 'users' ? 'default' : 'ghost'}
        onClick={() => onViewChange('users')}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Users
      </Button>
      <Button
        variant={currentView === 'events' ? 'default' : 'ghost'}
        onClick={() => onViewChange('events')}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Events
      </Button>
      <Button
        variant={currentView === 'registrations' ? 'default' : 'ghost'}
        onClick={() => onViewChange('registrations')}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Event Registrations
      </Button>
      <Button
        variant={currentView === 'submissions' ? 'default' : 'ghost'}
        onClick={() => onViewChange('submissions')}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Submissions
      </Button>
    </div>
  );
};

export default AdminNavigation;
