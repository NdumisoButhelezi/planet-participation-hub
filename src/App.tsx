
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import PublicShowcase from "./pages/PublicShowcase";
import VerifyUser from "./pages/VerifyUser";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import "./App.css";
import { HelmetProvider, Helmet } from "react-helmet-async";

function App() {
  // Force scrollbar to be present to prevent layout shifts
  useEffect(() => {
    document.body.classList.add('overflow-y-scroll');
    
    // Add a class to handle mobile viewport height issues
    document.documentElement.classList.add('h-full');
    document.body.classList.add('h-full');
    
    // Add a viewport height fix for mobile browsers
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      document.body.classList.remove('overflow-y-scroll');
      document.documentElement.classList.remove('h-full');
      document.body.classList.remove('h-full');
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>PlutoDev - Arctic Learning Zone</title>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/showcase" element={<PublicShowcase />} />
          <Route path="/verify/:userId/:hash" element={<VerifyUser />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
