import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Video, Edit, Music, Zap, BookOpen } from "lucide-react";

const suggestions = [
  {
    id: "breathing",
    title: "Breathing Exercise",
    description: "5-minute guided breathing to help you relax",
    duration: "5 min",
    icon: Zap,
    gradient: "from-accent/10 to-accent/5",
    borderColor: "border-accent/20",
    iconColor: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    id: "video",
    title: "Uplifting Content",
    description: "Short inspiring videos to boost your mood",
    duration: "3 min",
    icon: Video,
    gradient: "from-secondary/10 to-secondary/5",
    borderColor: "border-secondary/20",
    iconColor: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  {
    id: "journal",
    title: "Journaling",
    description: "Write about three things you're grateful for",
    duration: "10 min",
    icon: Edit,
    gradient: "from-primary/10 to-primary/5",
    borderColor: "border-primary/20",
    iconColor: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    id: "music",
    title: "Calming Music",
    description: "Curated playlist to help you unwind",
    duration: "15 min",
    icon: Music,
    gradient: "from-purple-500/10 to-purple-500/5",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
];

export function SmartSuggestions() {
  const handleActivityClick = (activity: string) => {
    // TODO: Implement activity launching logic
    console.log("Activity selected:", activity);
  };

  return (
    <Card data-testid="smart-suggestions">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Suggested Activities</CardTitle>
        <p className="text-muted-foreground text-sm">
          Based on your current mood, here are some activities that might help
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`suggestion-card bg-gradient-to-br ${suggestion.gradient} rounded-lg p-4 border ${suggestion.borderColor} cursor-pointer hover-elevate`}
              onClick={() => handleActivityClick(suggestion.id)}
              data-testid={`activity-${suggestion.id}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${suggestion.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <suggestion.icon className={`${suggestion.iconColor} w-5 h-5`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                  <div className={`flex items-center text-xs ${suggestion.iconColor}`}>
                    <Heart className="w-3 h-3 mr-1" />
                    <span>{suggestion.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
