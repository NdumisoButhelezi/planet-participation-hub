
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain, AlertTriangle, XCircle, Mail, Key, Loader2, RocketIcon } from "lucide-react";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { User } from "@/types/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadingTips = [
    "🚀 Welcome back to PlutoDev! Your coding journey continues...",
    "💡 Pro Tip: Check out the Community Showcase for inspiration from fellow developers!",
    "⭐ Quick Reminder: Complete weekly challenges to earn bonus points and climb the leaderboard!",
    "🏆 Fun Fact: Our top students average 150+ points per week through consistent engagement!",
    "🎯 Success Strategy: The best way to learn is by building - start your next project today!"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Cycle through tips during loading
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 1500);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Check if user exists in Firestore and get their role
        const userQuery = query(collection(db, "users"), where("id", "==", user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as User;
          
          toast({
            title: "Welcome back!",
            description: "Successfully logged in.",
          });

          // Redirect based on user role
          if (userData.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          // If no user document exists, create one with default values
          await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email: user.email,
            skillLevel: "beginner",
            isAdmin: false,
            hasAcceptedAgreement: false,
            progress: 0,
            points: 0,
          });
          
          toast({
            title: "Welcome!",
            description: "Your account has been set up.",
          });
          
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      
      // Provide more specific error messages in English
      switch(error.code) {
        case 'auth/invalid-email':
          setError('Invalid email format. Please check your email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please check your email or sign up for a new account.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please check your password and try again.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid login credentials. Please check your email and password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later or reset your password.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection and try again.');
          break;
        default:
          setError('Login failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
      }
      
      toast({
        title: "Login Error",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(tipInterval);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
            <RocketIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Signing you in...</h2>
          <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto mb-6">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
          <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
            <div className="text-sm font-medium text-purple-700 mb-2">💡 PlutoDev Tip</div>
            <p className="text-gray-700 text-sm leading-relaxed transition-all duration-300">
              {loadingTips[currentTip]}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-gray-500">Enter your credentials to access your account</p>
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
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="text-center text-sm space-y-2">
          <a href="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
            Don't have an account? Sign up
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

export default Login;
