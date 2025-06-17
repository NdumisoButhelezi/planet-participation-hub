
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Trophy, Users } from "lucide-react";
import { User as UserType } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import QuickVerifyScanner from "@/components/verification/QuickVerifyScanner";

interface DashboardHeaderProps {
  user: UserType;
  onProfileClick: () => void;
  isAdmin?: boolean;
}

const DashboardHeader = ({ user, onProfileClick, isAdmin }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-blue-600">
              PLANET 09 AI WRITING
            </h1>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-4 ml-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/leaderboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/showcase")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Users className="h-4 w-4" />
                Showcase
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <QuickVerifyScanner />
            
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="hidden sm:flex"
              >
                Admin Panel
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage} alt={user.fullName || user.email} />
                    <AvatarFallback>
                      {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.fullName || user.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem onClick={onProfileClick} className="hover:bg-gray-50">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/leaderboard")} 
                  className="hover:bg-gray-50 md:hidden"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/showcase")} 
                  className="hover:bg-gray-50 md:hidden"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Showcase
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="hover:bg-gray-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
