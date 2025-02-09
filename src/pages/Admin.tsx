
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { User, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Shield } from "lucide-react";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userDoc = await getDocs(collection(db, "users"));
      const currentUserData = userDoc.docs.find(doc => doc.id === user.uid);
      
      if (!currentUserData?.data()?.isAdmin) {
        navigate("/dashboard");
        return;
      }

      // Fetch users and submissions
      const usersSnapshot = await getDocs(collection(db, "users"));
      const submissionsSnapshot = await getDocs(collection(db, "submissions"));
      
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      setSubmissions(submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
    };

    checkAdmin();
  }, [navigate]);

  const makeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isAdmin: true
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: true } : user
      ));
      
      toast({
        title: "Success",
        description: "User has been made admin",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleSubmission = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "submissions", submissionId), {
        status
      });
      
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status } : sub
      ));
      
      toast({
        title: "Success",
        description: `Submission ${status}`,
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
    <div className="min-h-screen bg-background">
      <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-xl font-semibold text-blue-600">Planet 09 AI Admin</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        {user.skillLevel} • {user.isAdmin ? "Admin" : "User"}
                      </p>
                    </div>
                    {!user.isAdmin && (
                      <Button 
                        variant="outline"
                        onClick={() => makeAdmin(user.id)}
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Make Admin
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
        </div>
      </main>
    </div>
  );
};

export default Admin;
