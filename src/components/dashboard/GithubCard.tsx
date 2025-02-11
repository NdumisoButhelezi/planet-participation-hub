
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";

const GithubCard = () => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            Check out our GitHub repository for additional resources, code examples, and community contributions.
          </p>
          <a 
            href="https://github.com/NdumisoButhelezi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
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
