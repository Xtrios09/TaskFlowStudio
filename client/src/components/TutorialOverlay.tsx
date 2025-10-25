import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: typeof Sparkles;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to TaskFlow Studio',
    description: 'Transform your goals into actionable milestones with AI-powered planning. Let us show you around!',
    icon: Sparkles,
  },
  {
    title: 'AI Goal Breakdown',
    description: 'Enter any high-level goal, and our AI will automatically break it down into structured tasks and subtasks.',
    icon: Sparkles,
    action: 'Try clicking "AI Insights" in the sidebar',
  },
  {
    title: 'Organize with Kanban',
    description: 'Drag and drop tasks across different stages. View your project timeline and track progress in real-time.',
    icon: Sparkles,
    action: 'Check out the "Projects" view',
  },
  {
    title: 'Command Palette',
    description: 'Press Ctrl+P (or Cmd+P) anytime to quickly navigate, create tasks, or switch themes.',
    icon: Sparkles,
    action: 'Try it now!',
  },
  {
    title: 'Unlock Achievements',
    description: 'Complete tasks, maintain streaks, and unlock achievements as you build productive habits.',
    icon: CheckCircle2,
  },
];

export function TutorialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem('taskflow-tutorial-completed') === 'true';
  });

  useEffect(() => {
    if (!hasSeenTutorial) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('taskflow-tutorial-completed', 'true');
    setHasSeenTutorial(true);
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen || hasSeenTutorial) {
    return null;
  }

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up" data-testid="tutorial-overlay">
      <Card className="max-w-lg w-full shadow-2xl border-primary/20 animate-bounce-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleSkip}
            data-testid="button-skip-tutorial"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display text-xl">{step.title}</CardTitle>
              <CardDescription className="text-sm">
                Step {currentStep + 1} of {tutorialSteps.length}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-foreground/90">{step.description}</p>
          {step.action && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {step.action}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            data-testid="button-tutorial-previous"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button onClick={handleNext} data-testid="button-tutorial-next">
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                Complete
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
