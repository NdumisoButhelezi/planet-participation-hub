
import { Progress } from "@/components/ui/progress";
import { User } from "@/types/user";

interface WelcomeSectionProps {
  user: User;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  const userName = user.fullName || user.name || user.email?.split('@')[0] || "Learner";
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Good {timeOfDay()}, {userName}! 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Your current skill level: {user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1)}
      </p>
      {!user.isAdmin && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Program Progress</p>
          <Progress value={user.progress || 0} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
