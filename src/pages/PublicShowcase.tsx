
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Submission, User, SkillLevel } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Share2, Trophy, Star, Calendar, User as UserIcon, Facebook, Linkedin, MapPin, Mail, Globe, Code, Award, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/dateUtils";
import LoadingTips from "@/components/shared/LoadingTips";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface SubmissionWithUser extends Submission {
  user: User;
}

const PublicShowcase = () => {
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | SkillLevel>("all");
  const [selectedProject, setSelectedProject] = useState<SubmissionWithUser | null>(null);
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

        const userDoc = await getDoc(doc(db, "users", submissionData.userId));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          submissionsWithUsers.push({
            ...submissionData,
            user: userData
          });
        }
      }

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
    const shareText = `🚀 Check out ${submission.user.name || 'this developer'}'s amazing ${getTaskDisplayName(submission.taskId)} from PlutoDev! 

"${submission.learningReflection.substring(0, 150)}..."

Discover talented developers at PlutoDev - where the next generation of tech talent is built! 💻✨`;
    const shareUrl = window.location.href;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Talented Developer: ${submission.user.name || 'PlutoDev'} | PlutoDev`)}&summary=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText + '\n\n' + shareUrl);
        toast({
          title: "Link copied!",
          description: "Project details copied to clipboard",
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-8">
          <LoadingTips />
        </div>
      </div>
    );
  }

  if (selectedProject) {
    const projectTitle = `${selectedProject.user.name || 'Developer'}'s Project | PlutoDev Talent Showcase`;
    const projectDescription = `Discover ${selectedProject.user.name || 'this developer'}'s amazing ${getTaskDisplayName(selectedProject.taskId)} - ${selectedProject.learningReflection.substring(0, 150)}...`;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Helmet>
          <title>{projectTitle}</title>
          <meta name="description" content={projectDescription} />
        </Helmet>
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  ← Back to Showcase
                </Button>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PlutoDev Talent
                </div>
              </div>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Join Platform
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Detailed Project View */}
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Developer Profile Section */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedProject.user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{selectedProject.user.name || "Developer"}</h1>
                      <p className="text-lg text-gray-600 flex items-center gap-2 mt-1">
                        <Code className="h-5 w-5" />
                        {selectedProject.user.course || "Software Developer"}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge className={getSkillLevelColor(selectedProject.user.skillLevel)} variant="secondary">
                          <Award className="h-4 w-4 mr-1" />
                          {selectedProject.user.skillLevel} Level
                        </Badge>
                        <Badge variant="outline" className="text-purple-600">
                          <Trophy className="h-4 w-4 mr-1" />
                          {selectedProject.user.points || 0} Points
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Share Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleShare(selectedProject, 'linkedin')}>
                      <Linkedin className="h-4 w-4 mr-2 text-blue-800" />
                      Share on LinkedIn
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShare(selectedProject, 'copy')}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Project Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  {getTaskDisplayName(selectedProject.taskId)}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Completed on {selectedProject.createdAt ? formatDate(selectedProject.createdAt) : 'Unknown date'}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Learning Reflection */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Learning Journey & Reflection
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    "{selectedProject.learningReflection}"
                  </p>
                </div>

                {/* Project Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedProject.peersEngaged}</div>
                    <div className="text-sm text-green-700">Peers Collaborated With</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedProject.user.progress || 0}%</div>
                    <div className="text-sm text-blue-700">Program Progress</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedProject.user.points || 0}</div>
                    <div className="text-sm text-purple-700">Achievement Points</div>
                  </div>
                </div>

                {/* Project Links */}
                <div className="flex flex-wrap gap-4">
                  {selectedProject.projectLink && (
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => window.open(selectedProject.projectLink, '_blank')}
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View Live Project
                    </Button>
                  )}
                  
                  {selectedProject.socialMediaLink && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => window.open(selectedProject.socialMediaLink, '_blank')}
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      View Source Code
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action for Employers */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Interested in Hiring {selectedProject.user.name || "this Developer"}?</h3>
                <p className="text-purple-100 mb-6 text-lg">
                  This developer has demonstrated exceptional skills and dedication through our comprehensive learning program.
                  Connect with talented developers like {selectedProject.user.name || "them"} through PlutoDev.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/register">Join Our Platform</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact for Partnerships
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Helmet>
        <title>PlutoDev Talent Showcase - Discover Amazing Developers</title>
        <meta name="description" content="Discover talented developers and their amazing projects at PlutoDev. See real portfolios from our learning community - perfect for employers and investors looking for fresh talent." />
      </Helmet>
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PlutoDev Talent Showcase
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Join Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🌟 Discover Amazing Developer Talent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore real projects built by talented developers in our learning community. 
            These portfolios showcase skills, creativity, and dedication - perfect for employers, 
            investors, and anyone looking to discover the next generation of tech talent.
          </p>
          <div className="flex justify-center gap-6 text-purple-600 text-lg">
            <span className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Real Projects</span>
            <span className="flex items-center gap-2"><Star className="h-5 w-5" /> Verified Skills</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5" /> Active Community</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            All Developers
          </Button>
          <Button
            variant={filter === "beginner" ? "default" : "outline"}
            onClick={() => setFilter("beginner")}
            className="flex items-center gap-2"
          >
            🌱 Rising Talent
          </Button>
          <Button
            variant={filter === "intermediate" ? "default" : "outline"}
            onClick={() => setFilter("intermediate")}
            className="flex items-center gap-2"
          >
            🚀 Skilled Developers
          </Button>
          <Button
            variant={filter === "advanced" ? "default" : "outline"}
            onClick={() => setFilter("advanced")}
            className="flex items-center gap-2"
          >
            ⚡ Expert Level
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
              <Card 
                key={submission.id} 
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 cursor-pointer"
                onClick={() => setSelectedProject(submission)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {submission.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{submission.user.name || "Developer"}</div>
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
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "{submission.learningReflection.length > 120 
                        ? submission.learningReflection.substring(0, 120) + '...' 
                        : submission.learningReflection}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{submission.peersEngaged}</div>
                      <div className="text-xs text-green-700">Collaborations</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{submission.user.points || 0}</div>
                      <div className="text-xs text-blue-700">Achievement Points</div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(submission);
                    }}
                  >
                    View Full Portfolio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action for Employers */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Looking to Hire Exceptional Talent? 💼
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
            These developers have completed rigorous training programs and demonstrated 
            real-world skills. Connect with them through our platform or partner with 
            PlutoDev for your talent acquisition needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Join Our Platform</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="h-5 w-5 mr-2" />
              Partner With Us
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicShowcase;
