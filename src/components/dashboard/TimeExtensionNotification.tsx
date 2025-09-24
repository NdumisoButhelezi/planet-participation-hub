import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, X } from "lucide-react";
import { format, addDays } from "date-fns";
import { User } from "@/types/user";
import { calculateProgramSchedule } from "@/utils/dateUtils";

interface TimeExtensionNotificationProps {
  user: User;
}

const TimeExtensionNotification = ({ user }: TimeExtensionNotificationProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show if user has a time extension and hasn't dismissed it yet
  const hasTimeExtension = user.submissionTimeExtension && user.submissionTimeExtension > 0;
  const lastExtensionDate = user.lastTimeExtensionDate;
  
  // Check if this is a recent extension (within last 7 days)
  const isRecentExtension = lastExtensionDate ? 
    new Date().getTime() - new Date(lastExtensionDate).getTime() < 7 * 24 * 60 * 60 * 1000 : false;

  useEffect(() => {
    // Reset dismissal when user gets a new extension
    if (lastExtensionDate) {
      const storageKey = `timeExtension-${user.id}-${new Date(lastExtensionDate).getTime()}`;
      const wasDismissed = localStorage.getItem(storageKey);
      setIsDismissed(!!wasDismissed);
    }
  }, [user.id, lastExtensionDate]);

  const handleDismiss = () => {
    if (lastExtensionDate) {
      const storageKey = `timeExtension-${user.id}-${new Date(lastExtensionDate).getTime()}`;
      localStorage.setItem(storageKey, 'true');
      setIsDismissed(true);
    }
  };

  if (!hasTimeExtension || !isRecentExtension || isDismissed) {
    return null;
  }

  // Calculate original and new deadlines
  const registrationDate = user.registrationDate ? new Date(user.registrationDate) : new Date();
  const originalSchedule = calculateProgramSchedule(registrationDate);
  const extensionDays = user.submissionTimeExtension || 0;
  const newEndDate = addDays(originalSchedule.endDate, extensionDays);

  return (
    <Card className="border-l-4 border-l-green-500 bg-green-50 shadow-md mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-800 text-lg">
                Time Extension Granted! 🎉
              </CardTitle>
              <CardDescription className="text-green-700">
                Your submission deadline has been extended
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white border-gray-300">
                Previous Deadline
              </Badge>
            </div>
            <div className="text-gray-600 font-medium">
              {format(originalSchedule.endDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 hover:bg-green-600">
                New Deadline
              </Badge>
            </div>
            <div className="text-green-800 font-bold text-lg">
              {format(newEndDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="text-sm">
            <span className="font-semibold text-green-800">
              +{extensionDays} days added
            </span>
            <span className="text-green-700 ml-2">
              Extended on {format(new Date(lastExtensionDate!), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-green-700 bg-white p-3 rounded-lg border border-green-200">
          <strong>What this means:</strong> You now have additional time to complete your weekly submissions and final project. 
          Make the most of this opportunity to excel in your learning journey!
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeExtensionNotification;