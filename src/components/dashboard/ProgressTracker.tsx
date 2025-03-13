
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklySchedule, formatDate } from "@/utils/dateUtils";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";

interface ProgressTrackerProps {
  schedule: WeeklySchedule;
}

const ProgressTracker = ({ schedule }: ProgressTrackerProps) => {
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
              <span className="font-medium">{schedule.progress}%</span>
            </div>
            <Progress value={schedule.progress} className="h-2" />
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
                .filter(week => week.week >= schedule.currentWeek)
                .slice(0, 3)
                .map(week => (
                  <div 
                    key={week.week} 
                    className="flex items-center justify-between text-sm p-2 border-l-2 border-indigo-400 bg-gray-50 rounded-r-md"
                  >
                    <div className="flex items-center gap-2">
                      {week.week === schedule.currentWeek ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Week {week.week} Tasks</span>
                    </div>
                    <span className="font-medium">{formatDate(week.date)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
