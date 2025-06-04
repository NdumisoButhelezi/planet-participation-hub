
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Submission, User, SkillLevel } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Share2, Trophy, Star, Calendar, User as UserIcon, Facebook, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/dateUtils";
import LoadingTips from "@/components/shared/LoadingTips";

interface SubmissionWithUser extends Submission {
  user: User;
}

const CommunityShowcase = () => {
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | SkillLevel>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedSubmissions();
  }, []);

  const fetchApprovedSubmissions = async () => {
    try {
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("status", "==", "approved")
      );
      
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissionsWithUsers: SubmissionWithUser[] = [];

      for (const submissionDoc of submissionsSnapshot.docs) {
        const submissionData = { 
          id: submissionDoc.id, 
          ...submissionDoc.data(),
          createdAt: submissionDoc.data().createdAt?.toDate()
        } as Submission;

        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", submissionData.userId));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          submissionsWithUsers.push({
            ...submissionData,
            user: userData
          });
        }
      }

      // Sort by creation date (newest first)
      submissionsWithUsers.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setSubmissions(submissionsWithUsers);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load community submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = filter === "all" 
    ? submissions 
    : submissions.filter(sub => sub.user.skillLevel === filter);

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskDisplayName = (taskId: string) => {
    if (taskId.startsWith("week-")) {
      const weekNum = taskId.split("-")[1];
      return `Week ${weekNum} Challenge`;
    }
    if (taskId.includes("playlist")) {
      return "Learning Path Project";
    }
    if (taskId.includes("youtu.be")) {
      return "Video Tutorial Project";
    }
    return "Special Project";
  };

  const handleShare = (submission: SubmissionWithUser, platform: 'facebook' | 'linkedin' | 'whatsapp' | 'copy') => {
    const shareText = `Check out ${submission.user.name}'s amazing ${getTaskDisplayName(submission.taskId)} on PlutoDev! 🚀\n\n"${submission.learningReflection.substring(0, 100)}..."\n\nJoin our coding community and start your development journey!`;
    const shareUrl = "https://planet-participation-hub.lovable.app";
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`${submission.user.name}'s Project on PlutoDev`)}&summary=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText + '\n' + shareUrl);
        toast({
          title: "Link copied!",
          description: "Project details copied to clipboard",
        });
        break;
    }
  };

  if (loading) {
    return <LoadingTips />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🌟 Community Showcase
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get inspired by the incredible work of your fellow developers! These are real projects 
          built by students just like you. Each submission represents hours of learning, creativity, 
          and determination. Your next great idea might be sparked right here! ✨
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          All Projects
        </Button>
        <Button
          variant={filter === "beginner" ? "default" : "outline"}
          onClick={() => setFilter("beginner")}
          className="flex items-center gap-2"
        >
          🌱 Beginner
        </Button>
        <Button
          variant={filter === "intermediate" ? "default" : "outline"}
          onClick={() => setFilter("intermediate")}
          className="flex items-center gap-2"
        >
          🚀 Intermediate
        </Button>
        <Button
          variant={filter === "advanced" ? "default" : "outline"}
          onClick={() => setFilter("advanced")}
          className="flex items-center gap-2"
        >
          ⚡ Advanced
        </Button>
      </div>

      {/* Submissions Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No projects found for this filter</div>
          <Button variant="outline" onClick={() => setFilter("all")}>
            View All Projects
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {submission.user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{submission.user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {submission.user.course || "Developer"}
                      </div>
                    </div>
                  </div>
                  <Badge className={getSkillLevelColor(submission.user.skillLevel)}>
                    {submission.user.skillLevel}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg mt-3 text-purple-700">
                  {getTaskDisplayName(submission.taskId)}
                </CardTitle>
                
                {submission.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(submission.createdAt)}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Learning Reflection */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Learning Reflection
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "{submission.learningReflection}"
                  </p>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{submission.peersEngaged}</div>
                    <div className="text-xs text-green-700">Peers Engaged</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{submission.user.points || 0}</div>
                    <div className="text-xs text-blue-700">Total Points</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {submission.projectLink && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => window.open(submission.projectLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Project
                    </Button>
                  )}
                  
                  {submission.socialMediaLink && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(submission.socialMediaLink, '_blank')}
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  )}
                  
                  {/* Share Dropdown */}
                  <div className="relative group">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <div className="flex flex-col gap-1 min-w-[120px]">
                        <Button size="sm" variant="ghost" onClick={() => handleShare(submission, 'facebook')} className="justify-start">
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Facebook
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShare(submission, 'linkedin')} className="justify-start">
                          <Linkedin className="h-4 w-4 mr-2 text-blue-800" />
                          LinkedIn
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShare(submission, 'whatsapp')} className="justify-start">
                          <div className="w-4 h-4 mr-2 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">W</div>
                          WhatsApp
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShare(submission, 'copy')} className="justify-start">
                          <Share2 className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inspiration Footer */}
      <div className="text-center mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <h3 className="text-xl font-semibold text-purple-700 mb-2">
          Ready to Join the Showcase? 🎯
        </h3>
        <p className="text-gray-600 mb-4">
          Complete your learning paths and submit your projects to inspire others!
          Every approved submission earns you points and recognition in our community.
        </p>
        <div className="flex justify-center gap-4 text-sm text-purple-600">
          <span>🏆 Earn Recognition</span>
          <span>⭐ Inspire Others</span>
          <span>🤝 Build Your Network</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityShowcase;
