
import { User, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Play, List } from "lucide-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SubmissionsManagementProps {
  submissions: Submission[];
  users: User[];
  onSubmissionUpdate: (updatedSubmissions: Submission[]) => void;
}

const SubmissionsManagement = ({ submissions, users, onSubmissionUpdate }: SubmissionsManagementProps) => {
  const { toast } = useToast();

  const playlistSubmissions = submissions.filter(sub => sub.taskId.includes("playlist"));
  const weeklySubmissions = submissions.filter(sub => !sub.taskId.includes("playlist"));

  const handleSubmission = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      const submission = submissions.find(sub => sub.id === submissionId);
      if (!submission) {
        throw new Error("Submission not found");
      }

      // Get the user document directly using doc reference
      const userRef = doc(db, "users", submission.userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data() as User;
      
      // Calculate points based on submission type and status
      let pointsChange = 0;
      if (status === "approved") {
        pointsChange = submission.taskId.includes("playlist") ? 30 : 50;
      } else {
        pointsChange = submission.taskId.includes("playlist") ? -30 : -50;
      }

      // Update user points
      await updateDoc(userRef, {
        points: (userData.points || 0) + pointsChange
      });

      // Update submission status
      const submissionRef = doc(db, "submissions", submissionId);
      await updateDoc(submissionRef, {
        status
      });
      
      // Update local state
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status } : sub
      );
      onSubmissionUpdate(updatedSubmissions);
      
      toast({
        title: "Success",
        description: `Submission ${status} successfully (${pointsChange > 0 ? '+' : ''}${pointsChange} points)`,
      });
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => {
    const user = users.find(u => u.id === submission.userId);
    
    return (
      <div key={submission.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">
              {user?.fullName || user?.email || "Unknown User"}
            </p>
            <p className="text-sm text-gray-600">
              {user?.course && `Course: ${user.course}`}
            </p>
            <p className="text-sm text-gray-600">
              Project Link: <a href={submission.projectLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{submission.projectLink}</a>
            </p>
            <p className="text-sm text-gray-600">
              Social Media: <a href={submission.socialMediaLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{submission.socialMediaLink}</a>
            </p>
            <p className="text-sm text-gray-600">
              Peers Engaged: {submission.peersEngaged}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            submission.status === "approved" ? "bg-green-100 text-green-800" :
            submission.status === "rejected" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>
            {submission.status}
          </span>
        </div>
        
        <div className="bg-white p-4 rounded border border-gray-200">
          <p className="text-sm text-gray-800">{submission.learningReflection}</p>
        </div>

        {submission.status === "pending" && (
          <div className="flex gap-2">
            <Button 
              onClick={() => handleSubmission(submission.id, "approved")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button 
              onClick={() => handleSubmission(submission.id, "rejected")}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="playlist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="playlist" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Playlist Submissions
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Weekly Submissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="playlist" className="space-y-4">
            {playlistSubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No playlist submissions yet</p>
            ) : (
              playlistSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            {weeklySubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No weekly submissions yet</p>
            ) : (
              weeklySubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubmissionsManagement;
