
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "💡 Pro Tip: Complete all weekly challenges to unlock bonus points and exclusive PlutoDev badges!",
    "🚀 Quick Win: Engage with 3+ peers on their projects each week to maximize your community score.",
    "⭐ Secret: The best submissions often include detailed learning reflections - judges love to see your thought process!",
    "🎯 Hack: Submit projects early in the week to get more peer feedback and improve your chances of approval.",
    "🏆 Elite Strategy: Combine multiple learning paths to create unique projects that stand out in the showcase.",
    "💪 Power Move: Help other students in their learning journey - mentoring others earns you leadership points!",
    "🔥 Hot Tip: Use the Community Showcase for inspiration, but always add your unique twist to projects.",
    "⚡ Speed Boost: Set up your development environment properly to code 3x faster than your peers.",
    "🎨 Creative Edge: Projects with good UI/UX design always score higher - invest time in making things look great!",
    "📈 Growth Hack: Track your progress weekly and celebrate small wins to maintain momentum throughout the program.",
    "🌟 Success Formula: Consistency beats perfection - submit something every week rather than waiting for the 'perfect' project.",
    "🤝 Network Effect: The connections you make in PlutoDev often lead to job opportunities and collaboration projects."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl text-white font-bold">P</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Amazing Content...</h3>
          <div className="w-32 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6">
            <div className="h-full bg-white rounded-full animate-pulse w-1/2"></div>
          </div>
        </div>
        
        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
          <div className="text-sm font-medium text-purple-700 mb-2">💡 PlutoDev Pro Tip</div>
          <p className="text-gray-700 text-sm leading-relaxed transition-all duration-500">
            {tips[currentTip]}
          </p>
        </div>
      </div>

      {/* Loading Skeletons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingTips;
