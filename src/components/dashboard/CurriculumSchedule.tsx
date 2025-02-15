
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [peersEngaged, setPeersEngaged] = useState("0");
  const [learningReflection, setLearningReflection] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmitReflection = () => {
    if (!learningReflection.trim()) {
      toast({
        title: "Error",
        description: "Please write your reflection before submitting",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Week ${selectedWeek} reflection submitted successfully!`,
    });

    setProjectLink("");
    setSocialMediaLink("");
    setPeersEngaged("0");
    setLearningReflection("");
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <CalendarDays className="h-6 w-6 text-blue-500" />
            Program Schedule (March - April 2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {curriculumData.map((week) => (
              <div key={week.week} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <span>Week {week.week}: {week.title}</span>
                      <span className="text-sm text-gray-500">{week.dates}</span>
                    </h3>
                    <ul className="mt-2 space-y-1 text-left list-disc list-inside">
                      {week.tasks.map((task, index) => (
                        <li key={index} className="text-gray-600 text-sm pl-0">
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full md:w-auto shrink-0"
                    onClick={() => {
                      setSelectedWeek(week.week);
                      setIsDialogOpen(true);
                    }}
                  >
                    Submit Reflection
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                Important Deadlines:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Submissions are due every Sunday at 11:59 PM (UTC+2)</li>
                <li>Leaderboard updates every Monday</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw]' : 'sm:max-w-[500px]'} p-4 md:p-6`}>
          <DialogHeader>
            <DialogTitle>Submit Week {selectedWeek} Reflection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                placeholder="Project GitHub/Drive Link"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Social Media Post Link"
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Number of peers engaged with"
                value={peersEngaged}
                onChange={(e) => setPeersEngaged(e.target.value)}
                min="0"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your reflection about what you learned..."
                value={learningReflection}
                onChange={(e) => setLearningReflection(e.target.value)}
                className="min-h-[150px] w-full"
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmitReflection}
            >
              Submit Reflection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CurriculumSchedule;
