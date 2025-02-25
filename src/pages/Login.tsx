
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Brain } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "@/types/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
          toast({
            title: "Error",
            description: "User account not properly set up. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password.",
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
          <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
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
