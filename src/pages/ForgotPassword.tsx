
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { updatePassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  RocketIcon, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  Snowflake, 
  ThermometerSnowflake,
  Wind 
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if email exists in the database
      const usersQuery = query(collection(db, "users"), where("email", "==", email));
      const userSnapshot = await getDocs(usersQuery);
      
      if (userSnapshot.empty) {
        throw new Error("No account found with this email address.");
      }

      // If email exists, proceed to reset password step
      setStep("reset");
      toast({
        title: "Email verified",
        description: "Please enter your new password",
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      
      setError(error.message || "Failed to verify email. Please try again.");
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      return;
    }

    try {
      // Sign in with email (we'll use a temporary login approach)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the password
      await updatePassword(user, password);
      
      // Success - password has been reset
      setSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now login with your new password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      setShake(true);
      setTimeout(() => setShake(false), 820);
      
      // Provide user-friendly error messages
      switch(error.code) {
        case 'auth/wrong-password':
          setError('The password is incorrect. Please try again.');
          break;
        case 'auth/weak-password':
          setError('New password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/requires-recent-login':
          setError('For security reasons, please log out and log back in before changing your password.');
          break;
        default:
          setError('Password reset failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
      }
      
      toast({
        title: "Reset Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Generate snowflakes
  const snowflakes = [...Array(10)].map((_, i) => (
    <div 
      key={i} 
      className="snowflake"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.8 + 0.2,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 3}s`
      }} 
    />
  ));

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative snowflakes */}
      {snowflakes}
      
      <div className={`w-full max-w-md p-8 space-y-6 north-pole-card ice-border transition-all ${shake ? 'animate-[shake_0.82s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}
        style={{ transformOrigin: '50% 50%' }}
      >
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ThermometerSnowflake className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-transparent bg-clip-text">
              PlutoDev
            </span>
          </a>
          <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-blue-600">
            {step === "verify" 
              ? "Enter your email to verify your account" 
              : "Create a new password for your account"}
          </p>
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
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            {step === "verify" ? (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 bg-white/70 border-blue-200 focus:border-blue-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying email...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 bg-white/70 border-blue-200 focus:border-blue-400"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 bg-white/70 border-blue-200 focus:border-blue-400"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </>
        )}
        
        <div className="text-center text-sm space-y-2">
          <a href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </a>
        </div>

        <div className="flex justify-center pt-4">
          <Snowflake className="h-6 w-6 text-blue-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
