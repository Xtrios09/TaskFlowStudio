import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { AppSidebar } from "@/components/AppSidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Dashboard } from "@/components/Dashboard";
import Settings from "@/pages/Settings";
import AIInsights from "@/pages/AIInsights";
import Projects from "@/pages/Projects";
import Timeline from "@/pages/Timeline";
import Team from "@/pages/Team";
import NotFound from "@/pages/not-found";
import { useState, useEffect, type CSSProperties } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/team" component={Team} />
      <Route path="/ai-insights" component={AIInsights} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AchievementProvider>
          <TooltipProvider>
            <SidebarProvider style={sidebarStyle}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <CommandPalette />
                  </header>
                  <main className="flex-1 overflow-y-auto">
                    <Router />
                  </main>
                </div>
              </div>
              <TutorialOverlay />
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </AchievementProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
