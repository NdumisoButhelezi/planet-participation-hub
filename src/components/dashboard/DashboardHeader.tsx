
import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Brain, UserCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import ProfileDialog from "./ProfileDialog";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <a 
          href="/" 
          className="text-xl font-semibold text-blue-600 hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <Brain className="h-6 w-6" />
          <span>Planet 09 AI</span>
        </a>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/leaderboard")}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4 text-yellow-500" />
            Leaderboard
          </Button>
          {user.isAdmin && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              Admin Panel
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2"
          >
            <UserCircle className="h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </div>
      </div>

      <ProfileDialog 
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </nav>
  );
};

export default DashboardHeader;
