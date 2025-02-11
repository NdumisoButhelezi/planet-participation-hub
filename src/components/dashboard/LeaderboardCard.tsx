
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";
import { User } from "@/types/user";

interface LeaderboardCardProps {
  users: User[];
}

const LeaderboardCard = ({ users }: LeaderboardCardProps) => {
  const sortedUsers = users
    .filter(user => (user.points ?? 0) > 0)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{user.fullName || user.email}</p>
                  <p className="text-sm text-gray-600">{user.points} points</p>
                </div>
              </div>
              {index < 3 && (
                <Award className={`h-6 w-6 ${
                  index === 0 ? "text-yellow-500" :
                  index === 1 ? "text-gray-400" :
                  "text-amber-600"
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
