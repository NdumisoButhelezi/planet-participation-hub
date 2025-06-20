import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal, Award, Crown, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoadingTips from "@/components/shared/LoadingTips";
import QuickVerifyScanner from "@/components/verification/QuickVerifyScanner";
import { Badge } from "@/components/ui/badge";

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

  const getUserDisplayName = (user: User) => {
    // First try to get from profile, then fallback to user fields
    if (user.profile?.fullName) return user.profile.fullName;
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    return user.email;
  };

  const getUserCourse = (user: User) => {
    return user.profile?.course || user.course || "Course not specified";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇 Champion";
    if (rank === 2) return "🥈 Runner-up";
    if (rank === 3) return "🥉 Third Place";
    if (rank <= 10) return "⭐ Top 10";
    return "🌟 Participant";
  };

  const getCardClass = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-lg";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-md";
    if (rank === 3) return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md";
    return "bg-white border-gray-200 hover:shadow-md transition-shadow";
  };

  if (loading) {
    return <LoadingTips />;
  }

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

      <main className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg">Celebrating our top performers and their achievements</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Zap className="h-5 w-5 text-blue-500" />
            <span className="text-blue-600 font-medium">{leaderboard.length} Active Participants</span>
          </div>
        </div>

        {/* Top 3 Podium Section */}
        {topThree.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">🏆 Hall of Fame</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {topThree.map((user, index) => (
                <div
                  key={user.id}
                  className={`${getCardClass(index + 1)} rounded-xl p-6 border-2 transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {getRankIcon(index + 1)}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {getUserDisplayName(user)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{getUserCourse(user)}</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold text-blue-600">{user.points || 0}</span>
                      <span className="text-gray-500">points</span>
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      {getRankBadge(index + 1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest of the Leaderboard */}
        {others.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">📊 Full Rankings</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <div className="grid grid-cols-12 gap-4 font-semibold">
                  <div className="col-span-2 text-center">Rank</div>
                  <div className="col-span-5">Participant</div>
                  <div className="col-span-3">Course</div>
                  <div className="col-span-2 text-center">Points</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {others.map((user, index) => {
                  const rank = index + 4;
                  return (
                    <div
                      key={user.id}
                      className={`${getCardClass(rank)} p-4 hover:bg-gray-50 transition-colors`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getRankIcon(rank)}
                            <span className="font-bold text-gray-700">#{rank}</span>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {getUserDisplayName(user).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{getUserDisplayName(user)}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {getRankBadge(rank)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <p className="text-gray-600 text-sm">{getUserCourse(user)}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-blue-500" />
                            <span className="font-bold text-lg text-blue-600">{user.points || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No participants found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
