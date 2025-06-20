
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, QrCode, CheckCircle, XCircle, User, Award, GraduationCap, Calendar, Target, Briefcase, Trophy } from "lucide-react";
import { User as UserType, Submission } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface DigitalIDCardProps {
  user: UserType;
  submissions: Submission[];
}

const DigitalIDCard = ({ user, submissions }: DigitalIDCardProps) => {
  const { toast } = useToast();
  const [isEligible, setIsEligible] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    week1Complete: false,
    profileComplete: false
  });

  // Essential skills gained from the 8-week challenge
  const skillsGained = [
    "AI-Powered Content Creation",
    "Digital Writing & Communication", 
    "Creative Problem Solving",
    "Project Management",
    "Peer Collaboration",
    "Technical Documentation",
    "Digital Portfolio Development",
    "Innovation & Entrepreneurship"
  ];

  useEffect(() => {
    // Check if Week 1 challenge is completed
    const week1Submission = submissions.find(sub => 
      sub.taskId === "week-1" && sub.status === "approved"
    );

    // Check if profile is completely filled
    const profileFields = [
      user.profile?.fullName,
      user.profile?.studentNumber,
      user.email,
      user.profile?.phoneNumber,
      user.profile?.course,
      user.profile?.yearOfStudy,
      user.profile?.aiInterestArea,
      user.profile?.learningStyle
    ];
    
    const profileComplete = profileFields.every(field => field && field.trim() !== "");

    setCompletionStatus({
      week1Complete: !!week1Submission,
      profileComplete
    });

    setIsEligible(!!week1Submission && profileComplete);
  }, [submissions, user.profile, user.email]);

  const generateDigitalID = () => {
    // Generate verification URL with user ID and timestamp
    const verificationHash = btoa(`${user.id}-${Date.now()}`).slice(0, 16);
    const digitalIDUrl = `${window.location.origin}/verify/${user.id}/${verificationHash}`;
    return digitalIDUrl;
  };

  const downloadQR = () => {
    const svg = document.querySelector('#digital-id-qr') as SVGElement;
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        ctx?.drawImage(img, 0, 0, 300, 300);
        
        const link = document.createElement('a');
        link.download = `${user.name}-digital-id-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        URL.revokeObjectURL(url);
        
        toast({
          title: "Digital ID Downloaded",
          description: "Your Digital ID QR code has been saved",
        });
      };
      
      img.src = url;
    }
  };

  const completedWeeks = submissions.filter(sub => 
    sub.status === "approved" && sub.taskId.startsWith("week-")
  ).length;

  const getSkillLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Professional Digital Credential</h2>
            <p className="text-blue-100 text-sm font-medium">PlutoDev AI Development Program</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-gray-900 font-medium">
                {user.profile?.fullName || user.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Student Number</p>
              <p className="text-gray-900 font-medium">
                {user.profile?.studentNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Course</p>
              <p className="text-gray-900 font-medium">
                {user.profile?.course || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Year of Study</p>
              <p className="text-gray-900 font-medium">
                {user.profile?.yearOfStudy || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress & Achievements Section */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Program Progress</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{completedWeeks}</div>
              <div className="text-xs text-blue-600 font-medium">Weeks Completed</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{user.points || 0}</div>
              <div className="text-xs text-green-600 font-medium">Total Points</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.round((completedWeeks / 8) * 100)}%</div>
              <div className="text-xs text-purple-600 font-medium">Completion</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
              <Badge className={`text-xs font-semibold border ${getSkillLevelColor(user.skillLevel)}`}>
                {user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1)}
              </Badge>
              <div className="text-xs text-amber-600 font-medium mt-1">Skill Level</div>
            </div>
          </div>
        </div>

        {/* Skills & Competencies Section */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Core Competencies</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skillsGained.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Status Section */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Certification Requirements</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {completionStatus.week1Complete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">Complete Week 1 Challenge</p>
                <p className="text-xs text-gray-500">Foundation project completed</p>
              </div>
              <Badge variant={completionStatus.week1Complete ? "default" : "destructive"} className="text-xs">
                {completionStatus.week1Complete ? "Completed" : "Pending"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {completionStatus.profileComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">Complete Profile Information</p>
                <p className="text-xs text-gray-500">All required fields filled</p>
              </div>
              <Badge variant={completionStatus.profileComplete ? "default" : "destructive"} className="text-xs">
                {completionStatus.profileComplete ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Digital ID Generation Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Digital Verification</h3>
          </div>
          
          {isEligible ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Eligible for Digital ID Certificate</span>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg">
                    <QrCode className="h-5 w-5 mr-2" />
                    Generate Professional Digital ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-gray-900">
                      Professional Digital ID Certificate
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-6 p-6">
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                      <QRCodeSVG
                        id="digital-id-qr"
                        value={generateDigitalID()}
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor="#1e40af"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {user.profile?.fullName || user.name}
                      </h4>
                      <p className="text-blue-600 font-semibold">
                        {user.profile?.course || "AI Development Program Graduate"}
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                        ✓ Verified by PlutoDev • Digital Skills Certified
                      </p>
                    </div>
                    <Button 
                      onClick={downloadQR} 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Digital Certificate
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                <Calendar className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <h4 className="font-semibold text-amber-800 mb-2">
                  Complete Requirements to Unlock Digital ID
                </h4>
                <p className="text-sm text-amber-700 mb-4">
                  Your professional digital certificate will be available once you meet all certification requirements.
                </p>
                <div className="text-xs text-amber-600 space-y-1">
                  <p>• Showcase verified AI development skills</p>
                  <p>• Professional credential for employers</p>
                  <p>• Instant verification via QR code</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;
