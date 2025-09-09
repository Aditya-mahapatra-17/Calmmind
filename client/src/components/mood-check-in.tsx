import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MoodCheckInProps {
  onMoodSubmit?: (moodLevel: number) => void;
}

const moodOptions = [
  { emoji: "😊", level: 5, type: "very-happy", label: "Great" },
  { emoji: "🙂", level: 4, type: "happy", label: "Good" },
  { emoji: "😐", level: 3, type: "neutral", label: "Okay" },
  { emoji: "😔", level: 2, type: "sad", label: "Down" },
  { emoji: "😢", level: 1, type: "very-sad", label: "Struggling" },
];

export function MoodCheckIn({ onMoodSubmit }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [moodSlider, setMoodSlider] = useState(5);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const moodMutation = useMutation({
    mutationFn: async (data: { moodLevel: number; moodType: string; notes?: string }) => {
      const res = await apiRequest("POST", "/api/mood", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Mood submitted successfully",
        description: "Thank you for checking in with us today!",
      });
      // Refresh user data and mood history
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mood/history"] });
      
      // Reset form
      setSelectedMood(null);
      setSelectedType("");
      setNotes("");
      setMoodSlider(5);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    setSelectedMood(mood.level);
    setSelectedType(mood.type);
    setMoodSlider(mood.level * 2); // Convert 1-5 to 1-10 scale
  };

  const handleSliderChange = (value: number) => {
    setMoodSlider(value);
    setSelectedMood(value);
    
    // Map slider value to mood type
    if (value <= 2) setSelectedType("very-sad");
    else if (value <= 4) setSelectedType("sad");
    else if (value <= 6) setSelectedType("neutral");
    else if (value <= 8) setSelectedType("happy");
    else setSelectedType("very-happy");
  };

  const handleSubmit = () => {
    if (!selectedMood || !selectedType) return;

    moodMutation.mutate({
      moodLevel: selectedMood,
      moodType: selectedType,
      notes: notes.trim() || undefined,
    });

    // Call parent callback
    onMoodSubmit?.(selectedMood);
  };

  return (
    <Card data-testid="mood-check-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Daily Mood Check-In</CardTitle>
        <p className="text-muted-foreground text-sm">Select how you're feeling right now</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Emoji Selection */}
        <div className="grid grid-cols-5 gap-4">
          {moodOptions.map((mood) => (
            <div key={mood.type} className="text-center">
              <div 
                className={`mood-emoji text-4xl mb-2 ${
                  selectedMood === mood.level ? "selected" : ""
                }`}
                onClick={() => handleMoodSelect(mood)}
                data-testid={`mood-emoji-${mood.type}`}
              >
                {mood.emoji}
              </div>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </div>
          ))}
        </div>
        
        {/* Mood Slider */}
        <div>
          <Label className="block text-sm font-medium text-foreground mb-3">
            Or use the mood slider:
          </Label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={moodSlider}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              data-testid="mood-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Very Low</span>
              <span>Neutral</span>
              <span>Very High</span>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <Label htmlFor="mood-notes" className="block text-sm font-medium text-foreground mb-2">
            What's on your mind? (Optional)
          </Label>
          <Textarea
            id="mood-notes"
            rows={3}
            placeholder="Share your thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="textarea-mood-notes"
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood || moodMutation.isPending}
          className="w-full"
          data-testid="button-submit-mood"
        >
          {moodMutation.isPending ? "Submitting..." : "Submit Mood Check-In"}
        </Button>
      </CardContent>
    </Card>
  );
}
