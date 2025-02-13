
import { PLAYLISTS } from "@/types/user";
import LearningPathCard from "./LearningPathCard";

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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  );
};

export default LearningPaths;
