import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MoodCheckIn } from "@/components/mood-check-in";
import { SmartSuggestions } from "@/components/smart-suggestions";
import { CounselorChat } from "@/components/counselor-chat";
import { MoodHistory } from "@/components/mood-history";
import { Gamification } from "@/components/gamification";
import { CrisisSupport } from "@/components/crisis-support";
import { ChatModal } from "@/components/chat-modal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Heart, Phone } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const handleMoodSubmit = (moodLevel: number) => {
    // Show crisis alert for very low mood levels
    if (moodLevel <= 2) {
      setShowCrisisAlert(true);
    } else {
      setShowCrisisAlert(false);
    }
  };

  const handleCrisisDismiss = () => {
    setShowCrisisAlert(false);
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Heart className="text-white text-lg" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold text-foreground">MindfulCare</h1>
                    <p className="text-xs text-muted-foreground">Your mental wellness companion</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center space-x-2"
                data-testid="button-crisis-support"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Crisis Support</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Welcome Section */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">
                          Welcome back, {user?.displayName || user?.username}
                        </h2>
                        <p className="text-muted-foreground">How are you feeling today?</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold streak-counter">{user?.streak || 0}</div>
                        <div className="text-xs text-muted-foreground">Day streak</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Heart className="text-secondary w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            "Every small step forward is progress worth celebrating."
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Daily Motivation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mood Check-In */}
                  <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
                  
                  {/* Smart Suggestions */}
                  <SmartSuggestions />
                  
                  {/* Mood History */}
                  <MoodHistory />
                </div>
                
                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Crisis Alert */}
                  {showCrisisAlert && (
                    <CrisisSupport onDismiss={handleCrisisDismiss} />
                  )}
                  
                  {/* Counselor Chat */}
                  <CounselorChat onStartChat={() => setIsChatModalOpen(true)} />
                  
                  {/* Gamification */}
                  <Gamification />
                  
                  {/* Quick Resources */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Quick Resources</h3>
                      <p className="text-muted-foreground text-sm">Helpful tools and information</p>
                    </div>
                    
                    <div className="space-y-3">
                      <a 
                        href="#" 
                        className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors hover-elevate"
                        data-testid="link-mental-health-guide"
                      >
                        <Heart className="text-primary w-4 h-4" />
                        <span className="text-sm text-foreground">Mental Health Guide</span>
                      </a>
                      
                      <a 
                        href="#" 
                        className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors hover-elevate"
                        data-testid="link-meditation-library"
                      >
                        <Heart className="text-accent w-4 h-4" />
                        <span className="text-sm text-foreground">Meditation Library</span>
                      </a>
                      
                      <a 
                        href="#" 
                        className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors hover-elevate"
                        data-testid="link-emergency-contacts"
                      >
                        <Phone className="text-secondary w-4 h-4" />
                        <span className="text-sm text-foreground">Emergency Contacts</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </SidebarProvider>
  );
}
