
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import "./App.css";

function App() {
  // Force scrollbar to be present to prevent layout shifts
  useEffect(() => {
    document.body.classList.add('overflow-y-scroll');
    return () => {
      document.body.classList.remove('overflow-y-scroll');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
