
import { CalendarDays, Book, Calendar } from "lucide-react";
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
      name: "Events",
      icon: Calendar,
      id: "events"
    }
  ];

  return (
    <div className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mr-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-2">Navigation</h3>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeSection(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left",
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
