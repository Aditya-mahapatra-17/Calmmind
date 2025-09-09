import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Achievement } from "@shared/schema";
import { CalendarCheck, Heart, Star, Trophy } from "lucide-react";

const achievementIcons = {
  "daily-tracker": CalendarCheck,
  "self-care-hero": Heart,
  "milestone": Star,
  "default": Trophy,
};

export function Gamification() {
  const { user } = useAuth();
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  return (
    <Card data-testid="gamification">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Your Progress</CardTitle>
        <p className="text-muted-foreground text-sm">Keep up the great work!</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Streak Counter */}
        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20">
          <div className="text-center">
            <div className="text-3xl font-bold streak-counter mb-1" data-testid="streak-counter">
              {user?.streak || 0}
            </div>
            <div className="text-sm text-muted-foreground">Days in a row</div>
            <div className="text-xs text-secondary mt-2">🔥 Keep it up!</div>
          </div>
        </div>
        
        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Recent Achievements</h4>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-24 h-4 mb-1" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !achievements || achievements.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                No achievements yet. Keep checking in daily to unlock badges!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => {
                const IconComponent = achievementIcons[achievement.type as keyof typeof achievementIcons] || achievementIcons.default;
                
                return (
                  <div 
                    key={achievement.id} 
                    className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover-elevate"
                    data-testid={`achievement-${achievement.type}`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <IconComponent className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Weekly Progress</h4>
          <div className="flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full ${
                  i < (user?.streak || 0) % 7 ? "bg-secondary" : "bg-muted"
                }`}
                data-testid={`progress-day-${i}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.min(7, user?.streak || 0)} of 7 days this week
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
