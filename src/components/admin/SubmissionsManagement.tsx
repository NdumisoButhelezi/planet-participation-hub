
import { User, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Play, List, Trash2, Filter, Search, MessageSquare, Clock } from "lucide-react";
import { doc, updateDoc, getDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { awardSubmissionPoints } from "@/lib/pointsSystem";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface SubmissionsManagementProps {
  submissions: Submission[];
  users: User[];
  onSubmissionUpdate: (updatedSubmissions: Submission[]) => void;
}

const SubmissionsManagement = ({ submissions, users, onSubmissionUpdate }: SubmissionsManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const playlistSubmissions = submissions.filter(sub => sub.taskId.includes("playlist"));
  const weeklySubmissions = submissions.filter(sub => !sub.taskId.includes("playlist"));

  const filterSubmissions = (submissionList: Submission[]) => {
    return submissionList.filter(submission => {
      const user = users.find(u => u.id === submission.userId);
      const userName = user?.fullName || user?.profile?.fullName || user?.email || "";
      
      const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.learningReflection.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleSubmissionWithFeedback = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      const submission = submissions.find(sub => sub.id === submissionId);
      if (!submission) {
        throw new Error("Submission not found");
      }

      const userRef = doc(db, "users", submission.userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      // Award points through the audit system
      await awardSubmissionPoints(submission.userId, submission.id, status === "approved", submission);

      const submissionRef = doc(db, "submissions", submissionId);
      await updateDoc(submissionRef, {
        status
      });

      // Save feedback if provided
      if (feedback.trim()) {
        await addDoc(collection(db, "feedback"), {
          submissionId,
          userId: submission.userId,
          feedback: feedback.trim(),
          createdAt: new Date(),
          adminAction: status
        });
      }
      
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status } : sub
      );
      onSubmissionUpdate(updatedSubmissions);
      
      const pointsChange = status === "approved" ? 10 : -5; // Using standard point values
      toast({
        title: "Success",
        description: `Submission ${status} successfully (${pointsChange > 0 ? '+' : ''}${pointsChange} points)${feedback.trim() ? ' with feedback' : ''}`,
      });

      setFeedback("");
      setIsDialogOpen(false);
      setSelectedSubmission(null);
      
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const submissionRef = doc(db, "submissions", submissionId);
      await deleteDoc(submissionRef);
      
      const updatedSubmissions = submissions.filter(sub => sub.id !== submissionId);
      onSubmissionUpdate(updatedSubmissions);
      
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const generateAIFeedback = async (submission: Submission) => {
    setIsGeneratingFeedback(true);
    try {
      const user = users.find(u => u.id === submission.userId);
      const displayName = user?.fullName || user?.profile?.fullName || user?.email || "Student";
      
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName: displayName,
          learningReflection: submission.learningReflection
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate feedback');
      }

      const data = await response.json();
      const generatedFeedback = data.feedback || '';
      
      setFeedback(generatedFeedback);
      
      toast({
        title: "AI Feedback Generated",
        description: "Review and edit the feedback before submitting",
      });
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI feedback. Please write manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const openFeedbackDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
    setFeedback("");
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => {
    const user = users.find(u => u.id === submission.userId);
    const displayName = user?.fullName || user?.profile?.fullName || user?.email || "Unknown User";
    
    return (
      <div className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200 space-y-4 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{displayName}</p>
                <p className="text-sm text-gray-600">
                  {user?.course || user?.profile?.course || "Course not specified"}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Project Link:</p>
                <a href={submission.projectLink} className="text-blue-600 hover:underline text-sm break-all" target="_blank" rel="noopener noreferrer">
                  {submission.projectLink}
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Social Media:</p>
                <a href={submission.socialMediaLink} className="text-blue-600 hover:underline text-sm break-all" target="_blank" rel="noopener noreferrer">
                  {submission.socialMediaLink}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Peers Engaged: {submission.peersEngaged}
              </Badge>
              <Badge variant={
                submission.status === "approved" ? "default" :
                submission.status === "rejected" ? "destructive" : "secondary"
              }>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDeleteSubmission(submission.id)}
              className="hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-2">Learning Reflection:</p>
          <p className="text-sm text-gray-800 leading-relaxed">{submission.learningReflection}</p>
        </div>

        {submission.status === "pending" && (
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={() => openFeedbackDialog(submission)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 flex-1"
            >
              <CheckCircle className="h-4 w-4" />
              Approve with Feedback
            </Button>
            <Button 
              onClick={() => openFeedbackDialog(submission)}
              variant="destructive"
              className="flex items-center gap-2 flex-1"
            >
              <XCircle className="h-4 w-4" />
              Reject with Feedback
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSubmissionsList = (submissionList: Submission[], title: string) => {
    const filteredSubmissions = filterSubmissions(submissionList);
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredSubmissions.length === 0 ? (
          <div className="text-center p-8 bg-white/50 rounded-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" ? "No submissions match your filters" : `No ${title.toLowerCase()} yet`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSubmissions.map(submission => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Submissions Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="playlist" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="playlist" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Play className="h-4 w-4" />
                Playlist Submissions ({playlistSubmissions.length})
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2 data-[state=active]:bg-white">
                <List className="h-4 w-4" />
                Weekly Submissions ({weeklySubmissions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="playlist">
              {renderSubmissionsList(playlistSubmissions, "Playlist Submissions")}
            </TabsContent>
            
            <TabsContent value="weekly">
              {renderSubmissionsList(weeklySubmissions, "Weekly Submissions")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Provide Feedback for Submission
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">
                  Submission by: {users.find(u => u.id === selectedSubmission.userId)?.fullName || 
                                 users.find(u => u.id === selectedSubmission.userId)?.profile?.fullName || 
                                 users.find(u => u.id === selectedSubmission.userId)?.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">Learning Reflection:</p>
                <p className="text-sm text-gray-800 italic">"{selectedSubmission.learningReflection}"</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Admin Feedback (Optional)</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateAIFeedback(selectedSubmission)}
                    disabled={isGeneratingFeedback}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGeneratingFeedback ? "Generating..." : "Generate AI Feedback"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Provide constructive feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleSubmissionWithFeedback(selectedSubmission.id, "approved")}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Submission
                </Button>
                <Button
                  onClick={() => handleSubmissionWithFeedback(selectedSubmission.id, "rejected")}
                  variant="destructive"
                  className="flex items-center gap-2 flex-1"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Submission
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmissionsManagement;
