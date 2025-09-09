import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";

interface CounselorChatProps {
  onStartChat: () => void;
}

export function CounselorChat({ onStartChat }: CounselorChatProps) {
  return (
    <Card data-testid="counselor-chat">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Talk to Someone</CardTitle>
        <p className="text-muted-foreground text-sm">
          Connect with trained counselors and peer supporters
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={onStartChat}
            className="w-full flex items-center justify-center space-x-2"
            variant="default"
            data-testid="button-start-counselor-chat"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Counselor</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            data-testid="button-join-peer-support"
          >
            <Users className="w-4 h-4" />
            <span>Peer Support Group</span>
          </Button>
        </div>
        
        {/* Online counselors indicator */}
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Available now:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full pulse-animation"></div>
              <span className="text-sm font-medium text-secondary">3 counselors</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
