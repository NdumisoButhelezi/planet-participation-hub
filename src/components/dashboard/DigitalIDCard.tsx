
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, QrCode, CheckCircle, XCircle, User, Award, GraduationCap } from "lucide-react";
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
      user.profile?.email,
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
  }, [submissions, user.profile]);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-500" />
          Digital ID & QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eligibility Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Eligibility Requirements:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {completionStatus.week1Complete ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={completionStatus.week1Complete ? "text-green-700" : "text-red-700"}>
                Complete Week 1 Challenge
              </span>
            </div>
            <div className="flex items-center gap-2">
              {completionStatus.profileComplete ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={completionStatus.profileComplete ? "text-green-700" : "text-red-700"}>
                Complete Profile Information
              </span>
            </div>
          </div>
        </div>

        {/* Skills Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Essential Skills Gained:</h4>
          <div className="grid grid-cols-2 gap-2">
            {skillsGained.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500">+{skillsGained.length - 4} more skills</p>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Progress Summary</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Completed Weeks: {completedWeeks}/8</p>
            <p>Total Points: {user.points || 0}</p>
            <p>Skill Level: {user.skillLevel}</p>
          </div>
        </div>

        {/* QR Code Generation */}
        {isEligible ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Generate Digital ID QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Your Digital ID QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 p-4">
                <div className="bg-white p-4 rounded-lg border">
                  <QRCodeSVG
                    id="digital-id-qr"
                    value={generateDigitalID()}
                    size={250}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p className="font-medium">{user.name}</p>
                  <p>{user.profile?.course || "Student Developer"}</p>
                  <p className="text-xs mt-2">Digital ID verified by PlutoDev</p>
                </div>
                <Button onClick={downloadQR} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Digital ID
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <User className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-yellow-700 mb-2">
              Complete the requirements above to generate your Digital ID
            </p>
            <p className="text-xs text-yellow-600">
              Your Digital ID will showcase your verified skills and achievements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;
