
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { ReactNode } from "react";

interface LearningPathCardProps {
  index: number;
  playlistUrl: string;
  customTitle?: string;
  customDescription?: string;
  customIcon?: ReactNode;
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

const LearningPathCard = ({
  index,
  playlistUrl,
  customTitle,
  customDescription,
  customIcon,
  projectLink,
  socialMediaLink,
  peersEngaged,
  learningReflection,
  onProjectLinkChange,
  onSocialMediaLinkChange,
  onPeersEngagedChange,
  onLearningReflectionChange,
  onSubmitReflection,
}: LearningPathCardProps) => {
  const [showVideo, setShowVideo] = useState(false);

  const toggleVideoPreview = () => {
    setShowVideo(prev => !prev);
  };
  
  // Determine if this is a single video or a playlist
  const isSingleVideo = !playlistUrl.includes('playlist');
  
  // Generate appropriate embed URL
  const embedUrl = isSingleVideo
    ? `https://www.youtube.com/embed/${playlistUrl.split('youtu.be/')[1]}`
    : `${playlistUrl.replace('playlist?list=', 'embed/videoseries?list=')}`;

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">
          {customTitle || `Learning Path ${index + 1}`}
        </CardTitle>
        {customDescription && (
          <div className="text-sm text-gray-600">{customDescription}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={toggleVideoPreview}
        >
          {showVideo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showVideo ? "Hide Video Preview" : "Show Video Preview"}
        </Button>

        {showVideo && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden animate-fade-in">
            <iframe
              src={embedUrl}
              title={customTitle || `Learning Path ${index + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-blue-600">
          {customIcon || <Play className="h-5 w-5" />}
          <span>Watch {isSingleVideo ? "Video" : "Playlist"}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Track Progress</span>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Project GitHub/Drive Link"
            value={projectLink}
            onChange={(e) => onProjectLinkChange(e.target.value)}
          />
          
          <Input
            placeholder="Social Media Post Link"
            value={socialMediaLink}
            onChange={(e) => onSocialMediaLinkChange(e.target.value)}
          />
          
          <Input
            type="number"
            placeholder="Number of peers engaged with"
            value={peersEngaged}
            onChange={(e) => onPeersEngagedChange(e.target.value)}
            min="0"
          />

          <Textarea
            placeholder="Write your reflection about what you learned..."
            value={learningReflection}
            onChange={(e) => onLearningReflectionChange(e.target.value)}
            className="min-h-[100px]"
          />

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onSubmitReflection(playlistUrl)}
          >
            Submit Reflection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathCard;
