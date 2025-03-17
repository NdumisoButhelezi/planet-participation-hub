
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklySchedule, formatDate } from "@/utils/dateUtils";
import { CalendarClock, CheckCircle2, Clock, CheckCircle, XCircle, AlertCircle, Timer } from "lucide-react";
import { Submission } from "@/types/user";
import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface ProgressTrackerProps {
  schedule: WeeklySchedule;
  submissions?: Submission[];
}

const ProgressTracker = ({ schedule, submissions = [] }: ProgressTrackerProps) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Update countdown timer every second
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      if (now > schedule.endDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = differenceInDays(schedule.endDate, now);
      const hours = differenceInHours(schedule.endDate, now) % 24;
      const minutes = differenceInMinutes(schedule.endDate, now) % 60;
      const seconds = differenceInSeconds(schedule.endDate, now) % 60;
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [schedule.endDate]);

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

  // Determine the next active week based on submissions
  const getNextActiveWeek = () => {
    const completedWeeks = new Set(
      submissions
        .filter(sub => sub.status === "approved" && sub.taskId.startsWith("week-"))
        .map(sub => parseInt(sub.taskId.replace("week-", "")))
    );
    
    for (let i = 1; i <= schedule.totalWeeks; i++) {
      if (!completedWeeks.has(i)) {
        return i;
      }
    }
    
    return schedule.currentWeek;
  };

  const nextActiveWeek = getNextActiveWeek();

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
        if (weekNum === nextActiveWeek) {
          return <Clock className="h-4 w-4 text-amber-500" />;
        }
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get remaining tasks
  const getRemainingTasks = () => {
    const totalTasks = schedule.totalWeeks;
    const completedTasks = submissions.filter(sub => sub.status === "approved" && sub.taskId.startsWith("week-")).length;
    return totalTasks - completedTasks;
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col p-3 rounded-lg bg-blue-50">
              <span className="text-xs font-medium text-blue-500 mb-1">ACTIVE WEEK</span>
              <span className="text-lg font-semibold">
                Week {nextActiveWeek} of {schedule.totalWeeks}
              </span>
            </div>
            
            <div className="flex flex-col p-3 rounded-lg bg-amber-50">
              <span className="text-xs font-medium text-amber-500 mb-1">TASKS REMAINING</span>
              <span className="text-lg font-semibold">{getRemainingTasks()} weeks</span>
            </div>
            
            <div className="flex flex-col p-3 rounded-lg bg-green-50">
              <span className="text-xs font-medium text-green-500 mb-1">PROGRAM ENDS</span>
              <span className="text-lg font-semibold">{formatDate(schedule.endDate)}</span>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-700">8-Week Challenge Countdown</h3>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xl font-bold text-indigo-800">{timeLeft.days}</div>
                <div className="text-xs text-indigo-500">Days</div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xl font-bold text-indigo-800">{timeLeft.hours}</div>
                <div className="text-xs text-indigo-500">Hours</div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xl font-bold text-indigo-800">{timeLeft.minutes}</div>
                <div className="text-xs text-indigo-500">Minutes</div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xl font-bold text-indigo-800">{timeLeft.seconds}</div>
                <div className="text-xs text-indigo-500">Seconds</div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-600">Upcoming Deadlines</h4>
            <div className="space-y-2">
              {schedule.weeklyDueDates
                .filter(week => week.week >= nextActiveWeek || getWeekStatus(week.week) !== "approved")
                .slice(0, 3)
                .map(week => {
                  const status = getWeekStatus(week.week);
                  const isActive = week.week === nextActiveWeek;
                  
                  return (
                    <div 
                      key={week.week} 
                      className={`flex items-center justify-between text-sm p-2 rounded-r-md ${
                        status === "approved" 
                          ? "border-l-2 border-green-500 bg-green-50" 
                          : status === "rejected"
                          ? "border-l-2 border-red-400 bg-red-50"
                          : isActive
                          ? "border-l-2 border-amber-500 bg-amber-50/50"
                          : "border-l-2 border-indigo-400 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(week.week)}
                        <span className={isActive ? "font-medium" : ""}>
                          Week {week.week} Tasks {isActive && "(Current)"}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        status === "approved" ? "text-green-600" : 
                        status === "rejected" ? "text-red-600" : 
                        isActive ? "text-amber-600" : ""
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
