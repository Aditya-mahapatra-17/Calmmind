import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MessageCircle, X } from "lucide-react";

interface CrisisSupportProps {
  onDismiss: () => void;
}

export function CrisisSupport({ onDismiss }: CrisisSupportProps) {
  const handleCallEmergency = () => {
    window.open("tel:988", "_self");
  };

  const handleEmergencyChat = () => {
    window.open("https://suicidepreventionlifeline.org/chat/", "_blank");
  };

  return (
    <Card className="crisis-alert border-destructive/30" data-testid="crisis-support">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-destructive w-5 h-5" />
            <CardTitle className="text-lg font-semibold text-destructive">Crisis Support</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-dismiss-crisis-alert"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-foreground">
          If you're having thoughts of self-harm or suicide, please reach out for help immediately.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <Button
          onClick={handleCallEmergency}
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2"
          data-testid="button-call-crisis-lifeline"
        >
          <Phone className="w-4 h-4" />
          <span>Call 988 - Crisis Lifeline</span>
        </Button>
        
        <Button
          onClick={handleEmergencyChat}
          className="w-full flex items-center justify-center space-x-2"
          data-testid="button-emergency-chat"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Emergency Chat</span>
        </Button>
        
        <div className="text-xs text-muted-foreground text-center pt-2">
          <p>You're not alone. Help is available 24/7.</p>
        </div>
      </CardContent>
    </Card>
  );
}
