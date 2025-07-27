
import { useIsMobile } from "@/hooks/use-mobile";
import { Users, CalendarDays, FileText, Clipboard, Activity, QrCode, Trophy } from "lucide-react";

interface AdminNavigationProps {
  currentView: 'users' | 'events' | 'submissions' | 'registrations' | 'analytics' | 'verification' | 'points-audit';
  onViewChange: (view: 'users' | 'events' | 'submissions' | 'registrations' | 'analytics' | 'verification' | 'points-audit') => void;
}

const AdminNavigation = ({ currentView, onViewChange }: AdminNavigationProps) => {
  const isMobile = useIsMobile();
  
  const navItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'submissions', label: 'Submissions', icon: FileText },
    { id: 'registrations', label: 'Registrations', icon: Clipboard },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'verification', label: 'Verification', icon: QrCode },
    { id: 'points-audit', label: 'Points Audit', icon: Trophy }
  ];
  
  return (
    <div className="overflow-x-auto">
      <div className="flex border-b border-gray-100">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              currentView === item.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-200'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {!isMobile && item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavigation;
