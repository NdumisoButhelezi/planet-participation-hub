import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Download, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Submission } from "@/types/user";
import jsPDF from 'jspdf';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    console.log("Starting admin camera scanner...");
    
    try {
      setCameraError(null);
      setIsScanning(true);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // Request camera permission and get stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }

      // Start decoding after a short delay to ensure video is ready
      setTimeout(() => {
        if (codeReader.current && videoRef.current && stream.active) {
          codeReader.current.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, error) => {
              if (result) {
                console.log("QR Code detected:", result.getText());
                handleScanResult(result.getText());
                stopScanning();
              }
              // Don't log NotFoundException as it's expected when no QR code is visible
              if (error && error.name !== 'NotFoundException') {
                console.error("Scanning error:", error);
              }
            }
          );
        }
      }, 500);

      console.log("Admin camera started successfully");

    } catch (error: any) {
      console.error("Error starting admin camera:", error);
      setCameraError(error.message || "Unable to access camera");
      toast({
        title: "Camera Error",
        description: "Please allow camera access and try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    console.log("Stopping admin camera scanner...");
    
    // Stop the video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Reset code reader
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
      // Extract user ID from the verification URL
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
      // Check if it's a URL or direct user ID
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
      // Fetch user data
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

      // Fetch user's submissions
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId)
      );
      
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissions = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Submission[];

      setUserSubmissions(submissions);

      toast({
        title: "User Verified",
        description: `Successfully loaded ${userData.name}'s profile`,
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

  const generatePDFReport = async () => {
    if (!scannedUser) return;

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text('PlutoDev Student Verification Report', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });

      // User Info
      let yPosition = 60;
      pdf.setFontSize(16);
      pdf.text('Student Information', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.text(`Name: ${scannedUser.name}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Email: ${scannedUser.email}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Course: ${scannedUser.profile?.course || 'Not specified'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Skill Level: ${scannedUser.skillLevel}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Total Points: ${scannedUser.points || 0}`, 20, yPosition);

      // Achievements
      yPosition += 25;
      pdf.setFontSize(16);
      pdf.text('Achievements', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      const approvedSubmissions = userSubmissions.filter(s => s.status === 'approved');
      pdf.text(`Approved Projects: ${approvedSubmissions.length}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Total Submissions: ${userSubmissions.length}`, 20, yPosition);
      
      // Employability Score
      const employabilityScore = Math.min(100, Math.round(((scannedUser.points || 0) / 10) + (approvedSubmissions.length >= 5 ? 20 : approvedSubmissions.length * 4)));
      yPosition += 10;
      pdf.text(`Employability Score: ${employabilityScore}%`, 20, yPosition);

      // Recent Projects
      if (approvedSubmissions.length > 0) {
        yPosition += 25;
        pdf.setFontSize(16);
        pdf.text('Recent Projects', 20, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(10);
        approvedSubmissions.slice(0, 5).forEach((submission, index) => {
          const projectName = submission.taskId.startsWith("week-") 
            ? `Week ${submission.taskId.split("-")[1]} Challenge`
            : "Special Project";
          pdf.text(`${index + 1}. ${projectName}`, 25, yPosition);
          yPosition += 8;
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 30;
          }
        });
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('This is an official verification document from PlutoDev', pageWidth / 2, pageHeight - 20, { align: 'center' });
      pdf.text('For verification: planet-participation-hub.lovable.app', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`${scannedUser.name}-verification-report.pdf`);
      
      toast({
        title: "Report Generated",
        description: "PDF verification report has been downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Verification Scanner</h2>
        <p className="text-gray-600">Scan student QR codes to verify their achievements and generate reports</p>
      </div>

      {/* Scanner Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <p className="text-xs text-gray-500">Allow camera access when prompted</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    className="w-full max-w-md mx-auto border rounded-lg bg-black"
                    autoPlay
                    playsInline
                    muted
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                  </div>
                </div>
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
            <h4 className="font-medium mb-2">Manual Input</h4>
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

      {/* Scanned User Profile */}
      {scannedUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Verified Student Profile
              </CardTitle>
              <Button onClick={generatePDFReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-lg">{scannedUser.name}</h4>
                <p className="text-gray-600">{scannedUser.email}</p>
                <p className="text-gray-600">{scannedUser.profile?.course || "Student Developer"}</p>
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {userSubmissions.filter(s => s.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Approved Projects</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {userSubmissions.length}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.min(100, Math.round(((scannedUser.points || 0) / 10) + (userSubmissions.filter(s => s.status === 'approved').length >= 5 ? 20 : userSubmissions.filter(s => s.status === 'approved').length * 4)))}%
                </div>
                <div className="text-sm text-gray-600">Employability Score</div>
              </div>
            </div>

            {/* Recent Submissions */}
            {userSubmissions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Submissions</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userSubmissions.slice(0, 10).map((submission) => (
                    <div key={submission.id} className="flex justify-between items-center p-2 bg-white border rounded">
                      <div>
                        <span className="font-medium">
                          {submission.taskId.startsWith("week-") 
                            ? `Week ${submission.taskId.split("-")[1]} Challenge`
                            : "Special Project"
                          }
                        </span>
                        <Badge 
                          variant={submission.status === 'approved' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {submission.status}
                        </Badge>
                      </div>
                      {submission.createdAt && (
                        <span className="text-sm text-gray-500">
                          {submission.createdAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
