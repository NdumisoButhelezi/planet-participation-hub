
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { SkillLevel } from "@/types/user";
import { Brain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const isAdmin = adminKey === "planet09admin";
      
      // Create user document with correct id field
      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: userCredential.user.uid, // Add this line to include the id field
        email,
        skillLevel,
        isAdmin,
        hasAcceptedAgreement: false,
        progress: 0,
        points: 0,
      });

      toast({
        title: "Account created",
        description: "Welcome to Planet 09 AI!",
      });

      // Redirect based on admin status
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg backdrop-blur-lg border border-gray-100">
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-transparent bg-clip-text">
              Planet 09 AI
            </span>
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
          <p className="text-gray-500">Join us and start your learning journey</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Select
              value={skillLevel}
              onValueChange={(value) => setSkillLevel(value as SkillLevel)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Admin Key (optional)"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-2"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="text-center text-sm space-y-2">
          <a href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
            Already have an account? Sign in
          </a>
          <div>
            <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              Return to Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
