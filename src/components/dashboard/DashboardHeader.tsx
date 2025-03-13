
import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { RocketIcon, UserCircle, Trophy, Coins, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import ProfileDialog from "./ProfileDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = (
    <>
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
    </>
  );

  return (
    <nav className="sticky top-0 w-full px-4 md:px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 md:gap-6">
          <a 
            href="/" 
            className="text-lg md:text-xl font-semibold text-purple-600 hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <RocketIcon className="h-6 w-6" />
            <span className="hidden md:inline">PlutoDev</span>
          </a>
          <div className="flex items-center gap-2 text-purple-600">
            <Coins className="h-5 w-5" />
            <span className="font-medium">{user.points ?? 0} points</span>
          </div>
        </div>
        
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => navigate("/leaderboard")}>
                <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                Leaderboard
              </DropdownMenuItem>
              {user.isAdmin && (
                <DropdownMenuItem onSelect={() => navigate("/admin")}>
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => setShowProfile(true)}>
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => auth.signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">
            {menuItems}
          </div>
        )}
      </div>

      <ProfileDialog 
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </nav>
  );
};

export default DashboardHeader;
