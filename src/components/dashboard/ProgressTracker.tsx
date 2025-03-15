
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklySchedule, formatDate } from "@/utils/dateUtils";
import { CalendarClock, CheckCircle2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Submission } from "@/types/user";

interface ProgressTrackerProps {
  schedule: WeeklySchedule;
  submissions?: Submission[];
}

const ProgressTracker = ({ schedule, submissions = [] }: ProgressTrackerProps) => {
  // Calculate actual progress based on submissions
  const calculateActualProgress = () => {
    if (!submissions || submissions.length === 0) return schedule.progress;
    
    const completedWeeks = new Set(
      submissions
        .filter(sub => sub.status === "approved" && sub.taskId.startsWith("week-"))
        .map(sub => parseInt(sub.taskId.replace("week-", "")))
    );
    
    const actualProgress = Math.min(
      Math.round((completedWeeks.size / schedule.totalWeeks) * 100),
      100
    );
    
    return actualProgress;
  };

  const actualProgress = calculateActualProgress();

  // Check submission status for a specific week
  const getWeekStatus = (weekNum: number) => {
    const weekSubmission = submissions.find(
      sub => sub.taskId === `week-${weekNum}`
    );
    
    if (!weekSubmission) return "pending";
    return weekSubmission.status;
  };

  // Get icon based on week status
  const getStatusIcon = (weekNum: number) => {
    const status = getWeekStatus(weekNum);
    
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        if (weekNum === schedule.currentWeek) {
          return <Clock className="h-4 w-4 text-amber-500" />;
        }
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-indigo-500" />
          Your Learning Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{actualProgress}%</span>
            </div>
            <Progress value={actualProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col p-3 rounded-lg bg-blue-50">
              <span className="text-xs font-medium text-blue-500 mb-1">CURRENT WEEK</span>
              <span className="text-lg font-semibold">
                Week {schedule.currentWeek} of {schedule.totalWeeks}
              </span>
            </div>
            
            <div className="flex flex-col p-3 rounded-lg bg-green-50">
              <span className="text-xs font-medium text-green-500 mb-1">COMPLETION DATE</span>
              <span className="text-lg font-semibold">{formatDate(schedule.endDate)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-600">Upcoming Deadlines</h4>
            <div className="space-y-2">
              {schedule.weeklyDueDates
                .filter(week => week.week >= schedule.currentWeek || getWeekStatus(week.week) !== "approved")
                .slice(0, 3)
                .map(week => {
                  const status = getWeekStatus(week.week);
                  
                  return (
                    <div 
                      key={week.week} 
                      className={`flex items-center justify-between text-sm p-2 rounded-r-md ${
                        status === "approved" 
                          ? "border-l-2 border-green-500 bg-green-50" 
                          : status === "rejected"
                          ? "border-l-2 border-red-400 bg-red-50"
                          : "border-l-2 border-indigo-400 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(week.week)}
                        <span>Week {week.week} Tasks</span>
                      </div>
                      <span className={`font-medium ${
                        status === "approved" ? "text-green-600" : 
                        status === "rejected" ? "text-red-600" : ""
                      }`}>
                        {formatDate(week.date)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
