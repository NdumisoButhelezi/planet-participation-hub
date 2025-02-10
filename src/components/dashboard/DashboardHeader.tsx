
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-600">Planet 09 AI</div>
        <div className="flex items-center gap-4">
          {user.isAdmin && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Button>
          )}
          <Button variant="ghost" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
