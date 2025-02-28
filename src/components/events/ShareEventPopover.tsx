
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface ShareEventPopoverProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventObjectives: string;
}

const ShareEventPopover = ({ eventId, eventName, eventDate, eventObjectives }: ShareEventPopoverProps) => {
  const { toast } = useToast();
  
  // Hardcode the specific URL provided by the user
  const shareUrl = "https://planet-participation-hub.lovable.app/events?id=LdA29tBgCZcNoCsnkO38";
  
  // Format the message consistently for all platforms
  const shareTitle = eventName;
  const shareText = `${eventName}\nJoin us for ${eventName} on ${eventDate}. Objectives: ${eventObjectives}.\nPlease create an account first to register.\n${shareUrl}`;

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
    // Use the same message format for WhatsApp
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct sharing API, so we'll copy the link and notify the user
    navigator.clipboard.writeText(shareText)
      .then(() => {
        toast({
          title: "Message copied to clipboard",
          description: "Open Instagram and paste in your story or direct message.",
        });
      })
      .catch(() => {
        toast({
          title: "Couldn't copy to clipboard",
          description: "Please copy this message manually:\n" + shareText,
          variant: "destructive",
        });
      });
  };

  return (
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
  );
};

export default ShareEventPopover;
