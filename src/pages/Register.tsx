
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { SkillLevel } from "@/types/user";
import { Brain, AlertTriangle, XCircle, Mail, Key, User, Loader2, ShieldCheck, RocketIcon } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Password validation
      if (password.length < 6) {
        throw {
          code: 'auth/weak-password',
          message: 'Password should be at least 6 characters'
        };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const isAdmin = adminKey === "planet09admin";
      
      // Create user document with correct id field
      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: userCredential.user.uid,
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
    } catch (error: any) {
      console.error("Registration error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      
      // Provide more specific error messages in English
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format. Please enter a valid email address.');
          break;
        case 'auth/operation-not-allowed':
          setError('Registration is currently disabled. Please try again later.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters with numbers and special characters.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection and try again.');
          break;
        default:
          setError('Registration failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
      }
      
      toast({
        title: "Registration Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className={`w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg backdrop-blur-lg border border-gray-100 transition-all ${shake ? 'animate-[shake_0.82s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}
        style={{ transformOrigin: '50% 50%' }}
      >
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <RocketIcon className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-transparent bg-clip-text">
              PlutoDev
            </span>
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
          <p className="text-gray-500">Join us and start your coding journey</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto -mr-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10"
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 animate-fade-in">
              Password must be at least 6 characters
            </p>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={skillLevel}
                onValueChange={(value) => setSkillLevel(value as SkillLevel)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent className="animate-fade-in">
                  <SelectItem value="beginner" className="flex items-center">
                    <span>Beginner</span>
                  </SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Admin Key (optional)"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
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
