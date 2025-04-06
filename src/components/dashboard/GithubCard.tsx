
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const GithubCard = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg ice-border">
      <CardHeader className={isMobile ? "px-3 py-3" : "px-4 sm:px-6"}>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Github className="h-4 w-4 sm:h-5 sm:w-5" />
          GitHub Resources
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 pb-3" : "px-4 sm:px-6"}>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600">
            Check out our GitHub repository for additional resources, code examples, and community contributions.
          </p>
          <a 
            href="https://github.com/NdumisoButhelezi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-700"
          >
            <Github className="h-4 w-4" />
            Visit Our GitHub
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default GithubCard;
