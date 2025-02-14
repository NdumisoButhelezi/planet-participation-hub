
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WeeklyTask {
  week: number;
  dates: string;
  title: string;
  tasks: string[];
}

const curriculumData: WeeklyTask[] = [
  {
    week: 1,
    dates: "March 3 - March 9",
    title: "GitHub & LinkedIn Setup",
    tasks: [
      "Set up GitHub & LinkedIn profiles",
      "Clone repo template and install dependencies",
      "Basic introduction to HTML, CSS, JS/TS with Vite"
    ]
  },
  {
    week: 2,
    dates: "March 10 - March 16",
    title: "Basic Portfolio Structure",
    tasks: [
      "Create a simple homepage layout",
      "Understand HTML structure & semantic elements",
      "Add a basic navigation bar & footer"
    ]
  },
  {
    week: 3,
    dates: "March 17 - March 23",
    title: "Styling with CSS",
    tasks: [
      "Learn CSS fundamentals (Flexbox, Grid)",
      "Create responsive layouts",
      "Use CSS animations & transitions"
    ]
  },
  {
    week: 4,
    dates: "March 24 - March 30",
    title: "JavaScript Interactivity",
    tasks: [
      "Add dynamic content with JavaScript",
      "Implement form validation",
      "Create basic event-driven UI interactions"
    ]
  },
  {
    week: 5,
    dates: "March 31 - April 6",
    title: "Advanced Portfolio Features",
    tasks: [
      "Integrate contact form with Firebase",
      "Add light/dark mode toggle",
      "Work on smooth scrolling & UX enhancements"
    ]
  },
  {
    week: 6,
    dates: "April 7 - April 13",
    title: "Project Showcase",
    tasks: [
      "Display past projects & skills",
      "Implement a filterable projects section",
      "Fetch & display GitHub repositories dynamically"
    ]
  },
  {
    week: 7,
    dates: "April 14 - April 20",
    title: "Deployment & Optimization",
    tasks: [
      "Host the site on Vercel/Netlify",
      "Optimize for performance & SEO",
      "Use Lighthouse for auditing"
    ]
  },
  {
    week: 8,
    dates: "April 21 - April 27",
    title: "Final Submission & Reflection",
    tasks: [
      "Submit final portfolio link",
      "Write a reflection on progress & lessons learned",
      "Admin review & leaderboard ranking"
    ]
  }
];

const CurriculumSchedule = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CalendarDays className="h-6 w-6 text-blue-500" />
          Program Schedule (March - April 2025)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {curriculumData.map((week) => (
            <div key={week.week} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center justify-between">
                    <span>Week {week.week}: {week.title}</span>
                    <span className="text-sm text-gray-500">{week.dates}</span>
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {week.tasks.map((task, index) => (
                      <li key={index} className="text-gray-600 text-sm">
                        • {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline"
                  className="ml-4 shrink-0"
                  onClick={() => navigate(`/admin?week=${week.week}`)}
                >
                  View Submissions
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">
              Important Deadlines:
            </p>
            <ul className="mt-2 text-sm text-gray-600">
              <li>• Submissions are due every Sunday at 11:59 PM (UTC+2)</li>
              <li>• Leaderboard updates every Monday</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumSchedule;
