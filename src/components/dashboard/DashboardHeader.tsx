
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import QuickVerifyScanner from "@/components/verification/QuickVerifyScanner";

interface DashboardHeaderProps {
  user: any;
  onProfileClick: () => void;
  isAdmin?: boolean;
}

const DashboardHeader = ({ user, onProfileClick, isAdmin }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-semibold text-blue-600">
              PLANET 09 AI WRITING
            </a>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Verify Scanner - available to all users */}
            <QuickVerifyScanner />
            
            <Button 
              variant="ghost" 
              onClick={onProfileClick}
              className="text-sm"
            >
              {user?.name || "Profile"}
            </Button>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")}
                size="sm"
              >
                Admin Panel
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center gap-2"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
