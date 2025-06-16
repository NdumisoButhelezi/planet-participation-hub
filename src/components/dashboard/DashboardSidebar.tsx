
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, Users, Trophy, QrCode } from "lucide-react";

interface DashboardSidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
}

const DashboardSidebar = ({ activeSection, onChangeSection }: DashboardSidebarProps) => {
  const menuItems = [
    { id: "weekly-program", label: "Weekly Program", icon: Calendar },
    { id: "learning-paths", label: "Learning Paths", icon: BookOpen },
    { id: "digital-id", label: "Digital ID", icon: QrCode },
    { id: "community-showcase", label: "Community", icon: Users },
    { id: "events", label: "Events", icon: Trophy },
  ];

  return (
    <Card className="w-full md:w-64 h-fit">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => onChangeSection(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default DashboardSidebar;
