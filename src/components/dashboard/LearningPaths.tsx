
import { PLAYLISTS } from "@/types/user";
import LearningPathCard from "./LearningPathCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BookOpen, GitMerge, Code } from "lucide-react";

interface LearningPathsProps {
  skillLevel: keyof typeof PLAYLISTS;
  projectLink: string;
  socialMediaLink: string;
  peersEngaged: string;
  learningReflection: string;
  onProjectLinkChange: (value: string) => void;
  onSocialMediaLinkChange: (value: string) => void;
  onPeersEngagedChange: (value: string) => void;
  onLearningReflectionChange: (value: string) => void;
  onSubmitReflection: (playlistUrl: string) => void;
}

const LearningPaths = ({
  skillLevel,
  projectLink,
  socialMediaLink,
  peersEngaged,
  learningReflection,
  onProjectLinkChange,
  onSocialMediaLinkChange,
  onPeersEngagedChange,
  onLearningReflectionChange,
  onSubmitReflection,
}: LearningPathsProps) => {
  const userPlaylists = PLAYLISTS[skillLevel];
  const authSeries = PLAYLISTS.authSeries;
  
  // Authentication series metadata
  const authSeriesMetadata = [
    {
      module: "📘 Module 1: Introduction to Authentication",
      title: "EP 01: Overview of Firebase Authentication",
      tech: "🔗 Android Studio + Java + Python + VS Code + Firebase Realtime DB",
      icon: <Shield className="text-blue-500" />
    },
    {
      module: "📗 Module 2: Web App Auth",
      title: "EP 02: Login & Register with Flask (Python) + Firebase",
      tech: "",
      icon: <BookOpen className="text-green-500" />
    },
    {
      module: "📙 Module 3: Real App Integration",
      title: "EP 03: Clone & Run a Home Affairs Booking App",
      tech: "🔗 Android Studio + Java + GitHub",
      icon: <GitMerge className="text-orange-500" />
    },
    {
      module: "📕 Module 4: Deep Dive - Identity Auth",
      title: "EP 04: Identity Login & Registration Flow",
      tech: "",
      icon: <Shield className="text-red-500" />
    },
    {
      module: "Module 5: TypeScript Vite Login & Register",
      title: "Modern Authentication with Vite",
      tech: "",
      icon: <Code className="text-indigo-500" />
    }
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md ice-border">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Learning Paths</h2>
      
      <Tabs defaultValue="skill-paths" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="skill-paths">Skill Paths</TabsTrigger>
          <TabsTrigger value="auth-series">Authentication Series</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skill-paths">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userPlaylists.map((playlistUrl, index) => (
              <LearningPathCard
                key={index}
                index={index}
                playlistUrl={playlistUrl}
                projectLink={projectLink}
                socialMediaLink={socialMediaLink}
                peersEngaged={peersEngaged}
                learningReflection={learningReflection}
                onProjectLinkChange={onProjectLinkChange}
                onSocialMediaLinkChange={onSocialMediaLinkChange}
                onPeersEngagedChange={onPeersEngagedChange}
                onLearningReflectionChange={onLearningReflectionChange}
                onSubmitReflection={onSubmitReflection}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="auth-series">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authSeries.map((videoUrl, index) => (
              <LearningPathCard
                key={`auth-${index}`}
                index={index}
                playlistUrl={videoUrl}
                customTitle={authSeriesMetadata[index].title}
                customDescription={authSeriesMetadata[index].module}
                customIcon={authSeriesMetadata[index].icon}
                projectLink={projectLink}
                socialMediaLink={socialMediaLink}
                peersEngaged={peersEngaged}
                learningReflection={learningReflection}
                onProjectLinkChange={onProjectLinkChange}
                onSocialMediaLinkChange={onSocialMediaLinkChange}
                onPeersEngagedChange={onPeersEngagedChange}
                onLearningReflectionChange={onLearningReflectionChange}
                onSubmitReflection={onSubmitReflection}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPaths;
