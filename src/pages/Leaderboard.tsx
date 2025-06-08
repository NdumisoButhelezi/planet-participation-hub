import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingTips from "@/components/shared/LoadingTips";
import QuickVerifyScanner from "@/components/verification/QuickVerifyScanner";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const usersCollection = collection(db, "users");
      const leaderboardQuery = query(usersCollection, orderBy("points", "desc"));
      const querySnapshot = await getDocs(leaderboardQuery);

      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.points !== undefined) {
          users.push(userData);
        }
      });

      setLeaderboard(users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingTips />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-semibold text-blue-600">
                PLANET 09 AI WRITING
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <QuickVerifyScanner />
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-8">Leaderboard</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">User</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    {user.name}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">{user.points || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
