
import { useState } from "react";
import { RocketIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RocketIcon className="w-7 h-7 md:w-8 md:h-8 text-purple-600" />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-transparent bg-clip-text">
              PlutoDev
            </span>
          </div>
          
          {/* Mobile menu button - Hamburger icon */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-gray-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-gray-600 hover:text-purple-600">
              About Us
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-gray-600 hover:text-purple-600">
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Mobile menu - Slide down animation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-100 mt-3 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate("/about");
                  setMobileMenuOpen(false);
                }} 
                className="justify-start text-gray-600 hover:text-purple-600"
              >
                About Us
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }} 
                className="justify-start text-gray-600 hover:text-purple-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  navigate("/register");
                  setMobileMenuOpen(false);
                }} 
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
