
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Edit, Trash, Share2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onRegister: (eventId: string) => void;
}

const EventCard = ({ event, isAdmin, onEdit, onDelete, onRegister }: EventCardProps) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { toast } = useToast();

  // Use the specified Planet Participation Hub URL
  const baseUrl = "https://planet-participation-hub.lovable.app";
  const shareUrl = `${baseUrl}/events?id=${event.id}`;
  const shareTitle = event.name;
  const shareText = `Join us for ${event.name} on ${event.date}. Objectives: ${event.objectives}`;

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsapp = () => {
    const text = `${shareTitle}\n${shareText}\n${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct sharing API, so we'll copy the link and notify the user
    const textToCopy = `${shareTitle}\n${shareText}\n${shareUrl}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "Open Instagram and paste in your story or direct message.",
        });
      })
      .catch(() => {
        toast({
          title: "Couldn't copy to clipboard",
          description: "Please copy this link manually: " + shareUrl,
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-blue-50"
                >
                  <Share2 className="h-4 w-4 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2" align="end">
                <div className="text-sm font-medium mb-2">Share this event</div>
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    onClick={shareToFacebook} 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-blue-50"
                    title="Share to Facebook"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button 
                    onClick={shareToTwitter} 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-blue-50"
                    title="Share to X (Twitter)"
                  >
                    <Twitter className="h-5 w-5 text-gray-700" />
                  </Button>
                  <Button 
                    onClick={shareToLinkedin} 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-blue-50"
                    title="Share to LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-blue-800" />
                  </Button>
                  <Button 
                    onClick={shareToWhatsapp} 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-green-50"
                    title="Share to WhatsApp"
                  >
                    <div className="flex items-center justify-center bg-green-500 rounded-full h-5 w-5">
                      <span className="text-white text-xs font-bold">WA</span>
                    </div>
                  </Button>
                  <Button 
                    onClick={shareToInstagram} 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-pink-50"
                    title="Share to Instagram"
                  >
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {isAdmin && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(event)}
                  className="hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(event.id)}
                  className="hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{event.targetGroup.join(", ")}</span>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Objectives:</p>
            <p className="text-sm text-gray-600">{event.objectives}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Outcome:</p>
            <p className="text-sm text-gray-600">{event.outcome}</p>
          </div>
          <div className="pt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={() => setShowRegistrationForm(true)}
            >
              Register for Event
            </Button>
          </div>
        </CardContent>
      </Card>

      <EventRegistrationForm
        open={showRegistrationForm}
        onOpenChange={setShowRegistrationForm}
        eventId={event.id}
      />
    </>
  );
};

export default EventCard;
