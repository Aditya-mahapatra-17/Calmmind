import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { UserCheck, Send } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { user } = useAuth();
  const { 
    isConnected, 
    session, 
    messages, 
    sendMessage, 
    startSession, 
    isLoading, 
    error 
  } = useChat();
  
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !session && user) {
      startSession();
    }
  }, [isOpen, session, user, startSession]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !isConnected) return;
    
    sendMessage(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-96 flex flex-col p-0" data-testid="chat-modal">
        {/* Chat Header */}
        <DialogHeader className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
              <UserCheck className="text-secondary w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="font-medium text-foreground">Anonymous Counselor</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isConnected ? "Online now" : "Connecting..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" data-testid="chat-messages">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                <Skeleton className="flex-1 h-16 rounded-lg" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive text-sm">{error}</p>
              <Button 
                onClick={startSession} 
                size="sm" 
                className="mt-2"
                data-testid="button-retry-connection"
              >
                Retry Connection
              </Button>
            </div>
          ) : (
            <>
              {/* Welcome message */}
              <div className="flex items-start space-x-2 mb-4">
                <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="text-secondary w-3 h-3" />
                </div>
                <div className="bg-muted/30 rounded-lg px-3 py-2 max-w-xs">
                  <p className="text-sm text-foreground">
                    Hi there! I'm here to listen and support you. How are you feeling today?
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-2 mb-4 ${
                    message.senderType === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  data-testid={`message-${message.id}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.senderType === 'user' 
                      ? 'bg-primary/20' 
                      : 'bg-secondary/20'
                  }`}>
                    <UserCheck className={`w-3 h-3 ${
                      message.senderType === 'user' 
                        ? 'text-primary' 
                        : 'text-secondary'
                    }`} />
                  </div>
                  <div className={`rounded-lg px-3 py-2 max-w-xs ${
                    message.senderType === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/30'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </ScrollArea>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              data-testid="input-chat-message"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || !isConnected}
              size="icon"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This chat is anonymous and confidential
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
