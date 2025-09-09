import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoodEntry } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const moodTypeToEmoji = {
  "very-happy": "😊",
  "happy": "🙂",
  "neutral": "😐",
  "sad": "😔",
  "very-sad": "😢",
};

const moodTypeToLabel = {
  "very-happy": "Great mood",
  "happy": "Good mood",
  "neutral": "Neutral mood",
  "sad": "Down mood",
  "very-sad": "Struggling",
};

export function MoodHistory() {
  const { data: moodEntries, isLoading, error } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood/history"],
  });

  if (error) {
    return (
      <Card data-testid="mood-history">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Your Mood Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Failed to load mood history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="mood-history">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Your Mood Journey</CardTitle>
        <p className="text-muted-foreground text-sm">Track your emotional wellbeing over time</p>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div>
                    <Skeleton className="w-16 h-4 mb-1" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-3" />
              </div>
            ))}
          </div>
        ) : !moodEntries || moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No mood entries yet. Start tracking your mood today!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {moodEntries.slice(0, 5).map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  data-testid={`mood-entry-${entry.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {moodTypeToEmoji[entry.moodType as keyof typeof moodTypeToEmoji] || "😐"}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {moodTypeToLabel[entry.moodType as keyof typeof moodTypeToLabel] || "Unknown mood"}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          "{entry.notes.substring(0, 50)}{entry.notes.length > 50 ? "..." : ""}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
            
            {moodEntries.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium"
                data-testid="button-view-full-history"
              >
                View Full History
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
