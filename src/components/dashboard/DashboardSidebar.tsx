
import { CalendarDays, Book, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
}

const DashboardSidebar = ({ activeSection, onChangeSection }: DashboardSidebarProps) => {
  const navItems = [
    {
      name: "Weekly Program",
      icon: CalendarDays,
      id: "weekly-program"
    },
    {
      name: "Learning Paths",
      icon: Book,
      id: "learning-paths"
    },
    {
      name: "Community Showcase",
      icon: Users,
      id: "community-showcase"
    },
    {
      name: "Events",
      icon: Calendar,
      id: "events"
    }
  ];

  return (
    <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0 md:mr-4 ice-border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-2">Navigation</h3>
      <nav className="flex md:block overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-2 px-2 md:px-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeSection(item.id)}
            className={cn(
              "flex-shrink-0 flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-left whitespace-nowrap md:whitespace-normal md:w-full mb-0 md:mb-2 mr-2 md:mr-0",
              activeSection === item.id
                ? "bg-indigo-100 text-indigo-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className={cn("h-5 w-5", activeSection === item.id ? "text-indigo-600" : "text-gray-500")} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
