
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));
        
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortedUsers = users
    .filter(user => (user.points ?? 0) > 0)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={currentUser ?? { id: "", email: "", isAdmin: false, skillLevel: "beginner" }} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Trophy className="h-7 w-7 text-yellow-500" />
                Program Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8">Loading leaderboard...</div>
              ) : (
                <div className="space-y-4">
                  {sortedUsers.map((user, index) => (
                    <div 
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors
                        ${index === 0 ? 'bg-yellow-50' :
                          index === 1 ? 'bg-gray-50' :
                          index === 2 ? 'bg-amber-50' :
                          'bg-white hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.fullName || user.email}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {user.course || 'Program Participant'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-purple-600">
                          {user.points} points
                        </span>
                        {index < 3 && (
                          <Award className={`h-6 w-6 
                            ${index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-amber-600'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  How to Earn Points
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4" />
                    Submit weekly reflection (+10 points)
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4" />
                    Get your work approved (+30 points)
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4" />
                    Late submissions (-5 points)
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="h-4 w-4" />
                    Rejected submissions (-20 points)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
