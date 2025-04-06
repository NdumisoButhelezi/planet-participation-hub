
import { Button } from "@/components/ui/button";
import { Shield, Home, Users, Calendar, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminNavigationProps {
  currentView: 'users' | 'events' | 'submissions' | 'registrations';
  onViewChange: (view: 'users' | 'events' | 'submissions' | 'registrations') => void;
}

const AdminNavigation = ({ currentView, onViewChange }: AdminNavigationProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-6 px-2 sm:px-6 py-2 overflow-x-auto">
      <Button
        variant={currentView === 'users' ? 'default' : 'ghost'}
        onClick={() => onViewChange('users')}
        className="flex items-center gap-2 text-xs sm:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Users</span>
      </Button>
      <Button
        variant={currentView === 'events' ? 'default' : 'ghost'}
        onClick={() => onViewChange('events')}
        className="flex items-center gap-2 text-xs sm:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Events</span>
      </Button>
      <Button
        variant={currentView === 'registrations' ? 'default' : 'ghost'}
        onClick={() => onViewChange('registrations')}
        className="flex items-center gap-2 text-xs sm:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Registrations</span>
      </Button>
      <Button
        variant={currentView === 'submissions' ? 'default' : 'ghost'}
        onClick={() => onViewChange('submissions')}
        className="flex items-center gap-2 text-xs sm:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Submissions</span>
      </Button>
    </div>
  );
};

export default AdminNavigation;
