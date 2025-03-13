
import { RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RocketIcon className="w-8 h-8 text-blue-600 frost-float" />
            <span className="text-xl font-bold pluto-gradient-text">
              PlutoDev
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-gray-600 hover:text-blue-600 relative overflow-hidden group">
              <span>About Us</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-gray-600 hover:text-blue-600 relative overflow-hidden group">
              <span>Sign In</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Button>
            <Button onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md relative overflow-hidden group frost-slide">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
