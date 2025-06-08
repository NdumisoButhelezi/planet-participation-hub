
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Submission } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Star, Award, User as UserIcon, GraduationCap } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import LoadingTips from "@/components/shared/LoadingTips";

const VerifyUser = () => {
  const { userId, hash } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    if (!userId) {
      setError("Invalid verification link");
      setLoading(false);
      return;
    }

    try {
      // Fetch user data
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        setError("User not found");
        setLoading(false);
        return;
      }

      const userData = { id: userDoc.id, ...userDoc.data() } as User;
      setUser(userData);

      // Fetch user's approved submissions
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId),
        where("status", "==", "approved")
      );
      
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const userSubmissions = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Submission[];

      setSubmissions(userSubmissions);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load verification data");
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateEmployabilityScore = () => {
    if (!user) return 0;
    const points = user.points || 0;
    const submissionCount = submissions.length;
    const consistencyBonus = submissionCount >= 5 ? 20 : submissionCount * 4;
    return Math.min(100, Math.round((points / 10) + consistencyBonus));
  };

  if (loading) return <LoadingTips />;

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-gray-600">{error || "Unable to verify user"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PlutoDev Student Verification
          </h1>
          <p className="text-gray-600">Official Achievement Verification Portal</p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <p className="text-blue-100 flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {user.course || "Student Developer"}
                  </p>
                  {user.profile?.yearOfStudy && (
                    <p className="text-blue-100 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Year {user.profile.yearOfStudy}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                  <Trophy className="h-5 w-5 mr-2" />
                  {user.points || 0} Points
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{calculateEmployabilityScore()}%</div>
                <div className="text-sm text-gray-600">Employability Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{submissions.length}</div>
                <div className="text-sm text-gray-600">Completed Projects</div>
              </div>
              <div className="text-center">
                <Badge className={getSkillLevelColor(user.skillLevel)} style={{ fontSize: '14px', padding: '8px 16px' }}>
                  {user.skillLevel?.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Skill Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Achievements */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Learning Points</span>
                <Badge variant="outline">{user.points || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Approved Submissions</span>
                <Badge variant="outline">{submissions.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Skill Level</span>
                <Badge className={getSkillLevelColor(user.skillLevel)}>
                  {user.skillLevel}
                </Badge>
              </div>
              {user.profile?.aiInterestArea && (
                <div className="flex justify-between items-center">
                  <span>AI Specialization</span>
                  <Badge variant="secondary">{user.profile.aiInterestArea}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500" />
                Learning Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.profile?.learningStyle && (
                <div className="flex justify-between items-center">
                  <span>Learning Style</span>
                  <Badge variant="outline">{user.profile.learningStyle}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Program Duration</span>
                <Badge variant="outline">Active Student</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Consistency Rating</span>
                <Badge variant="outline">
                  {submissions.length >= 5 ? "Excellent" : submissions.length >= 3 ? "Good" : "Developing"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Recent Projects ({submissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No approved submissions yet</p>
            ) : (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {submission.taskId.startsWith("week-") 
                          ? `Week ${submission.taskId.split("-")[1]} Challenge`
                          : "Special Project"
                        }
                      </h4>
                      {submission.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(submission.createdAt)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">"{submission.learningReflection}"</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {submission.peersEngaged} peers engaged
                      </Badge>
                    </div>
                  </div>
                ))}
                {submissions.length > 5 && (
                  <p className="text-center text-gray-500 text-sm">
                    And {submissions.length - 5} more completed projects...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border">
          <p className="text-sm text-gray-600 mb-2">
            This verification was generated on {new Date().toLocaleDateString()} by PlutoDev
          </p>
          <p className="text-xs text-gray-500">
            Verification ID: {hash} • For more info: planet-participation-hub.lovable.app
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;
