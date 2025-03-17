
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Mail, AlertTriangle, XCircle, Loader2, RocketIcon, ArrowLeft } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if email exists in the database
      const usersQuery = query(collection(db, "users"), where("email", "==", email));
      const userSnapshot = await getDocs(usersQuery);
      
      if (userSnapshot.empty) {
        throw new Error("No account found with this email address.");
      }

      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      
      // Show success message
      setSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      
      // Provide user-friendly error messages
      if (error.message.includes("No account found")) {
        setError(error.message);
      } else {
        switch(error.code) {
          case 'auth/invalid-email':
            setError('Invalid email format. Please check your email address.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email. Please check your email or sign up for a new account.');
            break;
          case 'auth/too-many-requests':
            setError('Too many password reset attempts. Please try again later.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection and try again.');
            break;
          default:
            setError('Password reset failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
        }
      }
      
      toast({
        title: "Reset Error",
        description: error.message || "Failed to send reset email. Please try again.",
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
          <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-gray-500">Enter your email to receive a password reset link</p>
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
        
        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-fade-in">
              <p className="text-sm font-medium text-green-800">
                Password reset link has been sent to your email. Please check your inbox and follow the instructions.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}
        
        <div className="text-center text-sm space-y-2">
          <a href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
