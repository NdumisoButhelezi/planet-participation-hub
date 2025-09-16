
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const reflectionSchema = z.object({
  projectLink: z.string().url("Please enter a valid URL").min(1, "Project link is required"),
  socialMediaLink: z.string().url("Please enter a valid URL").min(1, "Social media link is required"),
  peersEngaged: z.string().regex(/^\d+$/, "Must be a number").refine(val => parseInt(val) >= 0, "Must be 0 or greater"),
  learningReflection: z.string().min(50, "Reflection must be at least 50 characters").max(1000, "Reflection must be less than 1000 characters"),
});

type ReflectionFormData = z.infer<typeof reflectionSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReflectionFormData>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: {
      projectLink,
      socialMediaLink,
      peersEngaged: peersEngaged || "0",
      learningReflection,
    },
  });

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (data) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            try {
              onProjectLinkChange(data.projectLink);
              onSocialMediaLinkChange(data.socialMediaLink);
              onPeersEngagedChange(data.peersEngaged);
              onLearningReflectionChange(data.learningReflection);
              await new Promise(resolve => setTimeout(resolve, 100)); // Allow state to update
              onSubmitReflection(playlistUrl);
            } finally {
              setIsSubmitting(false);
            }
          })} className="space-y-4">
            <FormField
              control={form.control}
              name="projectLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link *</FormLabel>
                  <FormControl>
                    <Input placeholder="Project GitHub/Drive Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialMediaLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Link *</FormLabel>
                  <FormControl>
                    <Input placeholder="Social Media Post Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="peersEngaged"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peers Engaged</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Number of peers engaged with" 
                      {...field}
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningReflection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Reflection *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your reflection about what you learned... (minimum 50 characters)"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Reflection"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LearningPathCard;
