
import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, QrCode, User as UserIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Submission } from "@/types/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const QuickVerifyScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return;

    try {
      setCameraError(null);
      setIsScanning(true);

      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error("No camera devices found");
      }

      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });

      const result = await codeReader.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log("QR Code scanned:", result.getText());
            handleScanResult(result.getText());
            stopScanning();
          }
          if (error && error.name !== 'NotFoundException') {
            console.error("Scanning error:", error);
          }
        }
      );
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      setCameraError(error.message || "Unable to access camera");
      toast({
        title: "Scanner Error",
        description: "Unable to access camera. Please check permissions or try manual input.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
    setCameraError(null);
  };

  const handleScanResult = async (scannedText: string) => {
    setLoading(true);
    try {
      console.log("Processing scanned text:", scannedText);
      const urlPattern = /\/verify\/([^\/]+)\/([^\/]+)/;
      const match = scannedText.match(urlPattern);
      
      if (!match) {
        toast({
          title: "Invalid QR Code",
          description: "This doesn't appear to be a valid PlutoDev verification code",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const userId = match[1];
      await fetchUserData(userId);
    } catch (error) {
      console.error("Error processing scan result:", error);
      toast({
        title: "Error",
        description: "Failed to process QR code",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleManualInput = async () => {
    if (!manualInput.trim()) return;
    
    setLoading(true);
    try {
      let userId = manualInput.trim();
      const urlPattern = /\/verify\/([^\/]+)\/([^\/]+)/;
      const match = manualInput.match(urlPattern);
      
      if (match) {
        userId = match[1];
      }

      await fetchUserData(userId);
    } catch (error) {
      console.error("Error with manual input:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        toast({
          title: "User Not Found",
          description: "No user found with this ID",
          variant: "destructive",
        });
        return;
      }

      const userData = { id: userDoc.id, ...userDoc.data() } as User;
      setScannedUser(userData);

      const submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId),
        where("status", "==", "approved")
      );
      
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissions = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Submission[];

      setUserSubmissions(submissions);

      toast({
        title: "User Verified ✓",
        description: `${userData.name} - ${submissions.length} approved projects`,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const resetScanner = () => {
    setScannedUser(null);
    setUserSubmissions([]);
    setManualInput("");
    setCameraError(null);
    stopScanning();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetScanner();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Verify Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Quick Student Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scanner Section */}
          {!scannedUser && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Camera Scanner */}
                <div className="text-center">
                  {!isScanning ? (
                    <div className="space-y-2">
                      <Button onClick={startScanning} className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Start Camera Scanner
                      </Button>
                      {cameraError && (
                        <p className="text-sm text-red-600">{cameraError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <video 
                        ref={videoRef} 
                        className="w-full max-w-sm mx-auto border rounded-lg"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Point your camera at a QR code</p>
                        <Button onClick={stopScanning} variant="destructive" className="flex items-center gap-2">
                          <CameraOff className="h-4 w-4" />
                          Stop Scanner
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Input */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter verification URL or user ID"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
                    />
                    <Button onClick={handleManualInput} disabled={loading}>
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verified User Profile */}
          {scannedUser && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verified Student</span>
                  </div>
                  <Button onClick={resetScanner} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-lg">{scannedUser.name}</h4>
                    <p className="text-gray-600">{scannedUser.profile?.course || "Student Developer"}</p>
                    <p className="text-gray-600">{scannedUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge className={getSkillLevelColor(scannedUser.skillLevel)}>
                      {scannedUser.skillLevel}
                    </Badge>
                    <div className="text-lg font-semibold text-blue-600">
                      {scannedUser.points || 0} Points
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {userSubmissions.length}
                    </div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {Math.min(100, Math.round(((scannedUser.points || 0) / 10) + (userSubmissions.length >= 5 ? 20 : userSubmissions.length * 4)))}%
                    </div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {userSubmissions.length >= 5 ? "High" : userSubmissions.length >= 3 ? "Good" : "Basic"}
                    </div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => window.open(`/verify/${scannedUser.id}/quick`, '_blank')}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Full Profile
                  </Button>
                  <Button onClick={resetScanner} variant="outline" size="sm">
                    Scan Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickVerifyScanner;
