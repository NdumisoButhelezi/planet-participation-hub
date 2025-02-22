
import { User, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface SubmissionsManagementProps {
  submissions: Submission[];
  users: User[];
  onSubmissionUpdate: (updatedSubmissions: Submission[]) => void;
}

const SubmissionsManagement = ({ submissions, users, onSubmissionUpdate }: SubmissionsManagementProps) => {
  const { toast } = useToast();

  const handleSubmission = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      const submission = submissions.find(sub => sub.id === submissionId);
      if (!submission) return;

      const userRef = doc(db, "users", submission.userId);
      const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", submission.userId)));
      const userData = userDoc.docs[0].data() as User;
      
      let pointsChange = 0;
      if (status === "approved") {
        pointsChange = 40;
      } else {
        pointsChange = -20;
      }

      await updateDoc(userRef, {
        points: (userData.points || 0) + pointsChange
      });

      await updateDoc(doc(db, "submissions", submissionId), {
        status
      });
      
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status } : sub
      );
      onSubmissionUpdate(updatedSubmissions);
      
      toast({
        title: "Success",
        description: `Submission ${status} and points updated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    User: {users.find(u => u.id === submission.userId)?.email}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsManagement;
