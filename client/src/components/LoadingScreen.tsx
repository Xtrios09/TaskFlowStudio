import { Sparkles } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-2xl opacity-40 animate-pulse-glow" />
          <div className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-6 animate-bounce-in">
            <Sparkles className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2 animate-fade-in-up">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent gradient-animate">
            TaskFlow Studio
          </h1>
          <p className="text-muted-foreground">Transforming goals into action</p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-gradient-shift w-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Loading your workspace<span className="animate-pulse">...</span></p>
        </div>
      </div>
    </div>
  );
}
