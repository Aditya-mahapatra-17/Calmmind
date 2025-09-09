import { Home, MessageCircle, Heart, TrendingUp, Shield, HelpCircle, Phone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Mood Tracking",
    url: "/mood",
    icon: TrendingUp,
  },
  {
    title: "Talk to Someone",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Self-Care",
    url: "/selfcare",
    icon: Heart,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: HelpCircle,
  },
];

const supportItems = [
  {
    title: "Crisis Support",
    url: "/crisis",
    icon: Phone,
    urgent: true,
  },
  {
    title: "Privacy & Safety",
    url: "/privacy",
    icon: Shield,
  },
];

export function AppSidebar() {
  const { user, logoutMutation } = useAuth();

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center">
            <Heart className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">MindfulCare</h1>
            <p className="text-xs text-sidebar-foreground/60">Your wellness companion</p>
          </div>
        </div>
        {user && (
          <div className="mt-3 p-2 bg-sidebar-accent/10 rounded-lg">
            <p className="text-sm font-medium text-sidebar-foreground">Welcome, {user.displayName || user.username}</p>
            <p className="text-xs text-sidebar-foreground/60">{user.streak} day streak</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`sidebar-link-${item.title.toLowerCase().replace(' ', '-')}`}>
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={item.urgent ? "text-destructive hover:text-destructive" : ""}
                    data-testid={`sidebar-link-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button 
            onClick={() => logoutMutation.mutate()}
            variant="outline" 
            className="w-full"
            data-testid="button-logout"
          >
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
