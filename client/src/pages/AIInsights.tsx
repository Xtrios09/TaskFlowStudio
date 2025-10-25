// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Sparkles, TrendingUp, AlertTriangle, Calendar, Target, CheckCircle2 } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { useState } from 'react';
// import { useAIGoalBreakdown, useCreateProjectFromAI } from '@/hooks/use-api';
// import { useToast } from '@/hooks/use-toast';
// import { useLocation } from 'wouter';
// import type { AIGoalBreakdownResponse } from '@shared/schema';

// export default function AIInsights() {
//   const [goal, setGoal] = useState('');
//   const [breakdown, setBreakdown] = useState<AIGoalBreakdownResponse | null>(null);
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();

//   const generateBreakdown = useAIGoalBreakdown();
//   const createProject = useCreateProjectFromAI();

//   const handleGenerateBreakdown = async () => {
//     try {
//       const result = await generateBreakdown.mutateAsync({
//         goal,
//         provider: 'huggingface',
//       });
//       setBreakdown(result);
//       toast({
//         title: 'Breakdown Generated!',
//         description: 'AI has analyzed your goal and created a project plan.',
//       });
//     } catch (error) {
//       toast({
//         title: 'Generation Failed',
//         description: 'Please try again or simplify your goal.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleCreateProject = async () => {
//     if (!breakdown) return;
    
//     try {
//       await createProject.mutateAsync(breakdown);
//       toast({
//         title: 'Project Created!',
//         description: `${breakdown.projectTitle} has been created with ${breakdown.tasks.length} tasks.`,
//       });
//       setGoal('');
//       setBreakdown(null);
//       setTimeout(() => setLocation('/projects'), 1000);
//     } catch (error) {
//       toast({
//         title: 'Creation Failed',
//         description: 'Failed to create project. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   return (
//     <div className="p-8 space-y-8 max-w-6xl animate-fade-in-up" data-testid="page-ai-insights">
//       <div>
//         <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent gradient-animate">
//           AI Insights
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Transform goals into actionable tasks with AI
//         </p>
//       </div>

//       {/* Goal Input */}
//       <Card className="border-primary/30">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Sparkles className="w-5 h-5 text-primary" />
//             <CardTitle className="font-display">AI Goal Breakdown</CardTitle>
//           </div>
//           <CardDescription>
//             Describe your goal, and AI will break it down into structured tasks
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Textarea
//             placeholder="E.g., Build a mobile app for fitness tracking with social features..."
//             className="min-h-32 resize-none"
//             value={goal}
//             onChange={(e) => setGoal(e.target.value)}
//             data-testid="textarea-goal-input"
//           />
//           <Button
//             onClick={handleGenerateBreakdown}
//             disabled={!goal.trim() || generateBreakdown.isPending}
//             className="w-full"
//             size="lg"
//             data-testid="button-generate-breakdown"
//           >
//             {generateBreakdown.isPending ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 Generate AI Breakdown
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Generated Breakdown */}
//       {breakdown && (
//         <Card className="border-primary/30 animate-fade-in-up">
//           <CardHeader>
//             <CardTitle className="font-display">{breakdown.projectTitle}</CardTitle>
//             <CardDescription>{breakdown.projectDescription}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <h3 className="font-medium mb-3">Generated Tasks ({breakdown.tasks.length})</h3>
//               <div className="space-y-2">
//                 {breakdown.tasks.map((task, idx) => (
//                   <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border" data-testid={`task-breakdown-${idx}`}>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <h4 className="font-medium text-sm">{task.title}</h4>
//                         <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
//                         {task.tags && task.tags.length > 0 && (
//                           <div className="flex gap-1 mt-2">
//                             {task.tags.map((tag, tagIdx) => (
//                               <span key={tagIdx} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">
//                                 {tag}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex flex-col items-end ml-4">
//                         <span className="text-xs font-medium text-muted-foreground capitalize">{task.priority}</span>
//                         {task.estimatedHours && (
//                           <span className="text-xs text-muted-foreground mt-1">{task.estimatedHours}h</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 onClick={handleCreateProject} 
//                 disabled={createProject.isPending}
//                 className="flex-1"
//                 data-testid="button-create-project-from-breakdown"
//               >
//                 {createProject.isPending ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle2 className="w-4 h-4 mr-2" />
//                     Create Project
//                   </>
//                 )}
//               </Button>
//               <Button variant="outline" onClick={() => setBreakdown(null)}>
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Project Health */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <TrendingUp className="w-5 h-5 text-primary" />
//             <CardTitle className="font-display">Project Health Score</CardTitle>
//           </div>
//           <CardDescription>
//             Overall assessment of your active projects
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Overall Health</span>
//               <span className="text-2xl font-display font-bold text-green-500">85%</span>
//             </div>
//             <Progress value={85} className="h-3" />
//           </div>
//           <p className="text-sm text-muted-foreground">
//             Projects are progressing well with minimal blockers
//           </p>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Bottleneck Detection */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500" />
//               <CardTitle className="font-display">Bottleneck Detection</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg" data-testid="bottleneck-item-1">
//                 <h4 className="font-medium text-sm">Design Review Pending</h4>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   3 tasks blocked waiting for design approval
//                 </p>
//               </div>
//               <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg" data-testid="bottleneck-item-2">
//                 <h4 className="font-medium text-sm">Backend Dependencies</h4>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Frontend tasks waiting for API completion
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Optimization Suggestions */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Target className="w-5 h-5 text-primary" />
//               <CardTitle className="font-display">Optimization Suggestions</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg" data-testid="suggestion-item-1">
//                 <h4 className="font-medium text-sm">Parallelize Backend Tasks</h4>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Split database migration into smaller chunks
//                 </p>
//               </div>
//               <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg" data-testid="suggestion-item-2">
//                 <h4 className="font-medium text-sm">Front-load Critical Path</h4>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Prioritize authentication before social features
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Deadline Predictions */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-accent" />
//             <CardTitle className="font-display">Deadline Predictions</CardTitle>
//           </div>
//           <CardDescription>
//             Estimated completion dates based on current velocity
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all" data-testid="prediction-item-1">
//               <div>
//                 <h4 className="font-medium">MVP Release</h4>
//                 <p className="text-sm text-muted-foreground">Based on current pace</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-display font-semibold">Feb 15, 2025</div>
//                 <div className="text-xs text-green-500">On track</div>
//               </div>
//             </div>
//             <div className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all" data-testid="prediction-item-2">
//               <div>
//                 <h4 className="font-medium">Full Launch</h4>
//                 <p className="text-sm text-muted-foreground">With all features</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-display font-semibold">Mar 30, 2025</div>
//                 <div className="text-xs text-yellow-500">At risk</div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertTriangle, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useAIGoalBreakdown, useCreateProjectFromAI } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import type { AIGoalBreakdownResponse } from '@shared/schema';

export default function AIInsights() {
  const [goal, setGoal] = useState('');
  const [breakdown, setBreakdown] = useState<AIGoalBreakdownResponse | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const generateBreakdown = useAIGoalBreakdown();
  const createProject = useCreateProjectFromAI();

  const handleGenerateBreakdown = async () => {
    try {
      const result = await generateBreakdown.mutateAsync({
        goal,
        provider: 'huggingface',
      });
      setBreakdown(result);
      toast({
        title: 'Breakdown Generated!',
        description: 'AI has analyzed your goal and created a project plan.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Please try again or simplify your goal.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateProject = async () => {
    if (!breakdown) return;
    
    try {
      await createProject.mutateAsync(breakdown);
      toast({
        title: 'Project Created!',
        description: `${breakdown.projectTitle} has been created with ${breakdown.tasks?.length || 0} tasks.`,
      });
      setGoal('');
      setBreakdown(null);
      setTimeout(() => setLocation('/projects'), 1000);
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Safe task count and tasks array
  const taskCount = breakdown?.tasks?.length || 0;
  const tasks = breakdown?.tasks || [];

  return (
    <div className="p-8 space-y-8 max-w-6xl animate-fade-in-up" data-testid="page-ai-insights">
      <div>
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent gradient-animate">
          AI Insights
        </h1>
        <p className="text-muted-foreground mt-2">
          Transform goals into actionable tasks with AI
        </p>
      </div>

      {/* Goal Input */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">AI Goal Breakdown</CardTitle>
          </div>
          <CardDescription>
            Describe your goal, and AI will break it down into structured tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g., Build a mobile app for fitness tracking with social features..."
            className="min-h-32 resize-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            data-testid="textarea-goal-input"
          />
          <Button
            onClick={handleGenerateBreakdown}
            disabled={!goal.trim() || generateBreakdown.isPending}
            className="w-full"
            size="lg"
            data-testid="button-generate-breakdown"
          >
            {generateBreakdown.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Breakdown
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Breakdown */}
      {breakdown && (
        <Card className="border-primary/30 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="font-display">{breakdown.projectTitle || 'Untitled Project'}</CardTitle>
            <CardDescription>{breakdown.projectDescription || 'No description provided'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Generated Tasks ({taskCount})</h3>
              <div className="space-y-2">
                {tasks.length > 0 ? (
                  tasks.map((task, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border" data-testid={`task-breakdown-${idx}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{task.title || `Task ${idx + 1}`}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{task.description || 'No description available'}</p>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {task.tags.map((tag, tagIdx) => (
                                <span key={tagIdx} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <span className="text-xs font-medium text-muted-foreground capitalize">
                            {task.priority || 'medium'}
                          </span>
                          {task.estimatedHours && (
                            <span className="text-xs text-muted-foreground mt-1">{task.estimatedHours}h</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tasks were generated. Please try again.
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateProject} 
                disabled={createProject.isPending || taskCount === 0}
                className="flex-1"
                data-testid="button-create-project-from-breakdown"
              >
                {createProject.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setBreakdown(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">Project Health Score</CardTitle>
          </div>
          <CardDescription>
            Overall assessment of your active projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <span className="text-2xl font-display font-bold text-green-500">85%</span>
            </div>
            <Progress value={85} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            Projects are progressing well with minimal blockers
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bottleneck Detection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <CardTitle className="font-display">Bottleneck Detection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg" data-testid="bottleneck-item-1">
                <h4 className="font-medium text-sm">Design Review Pending</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  3 tasks blocked waiting for design approval
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg" data-testid="bottleneck-item-2">
                <h4 className="font-medium text-sm">Backend Dependencies</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Frontend tasks waiting for API completion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Suggestions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="font-display">Optimization Suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg" data-testid="suggestion-item-1">
                <h4 className="font-medium text-sm">Parallelize Backend Tasks</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Split database migration into smaller chunks
                </p>
              </div>
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg" data-testid="suggestion-item-2">
                <h4 className="font-medium text-sm">Front-load Critical Path</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Prioritize authentication before social features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadline Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <CardTitle className="font-display">Deadline Predictions</CardTitle>
          </div>
          <CardDescription>
            Estimated completion dates based on current velocity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all" data-testid="prediction-item-1">
              <div>
                <h4 className="font-medium">MVP Release</h4>
                <p className="text-sm text-muted-foreground">Based on current pace</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-display font-semibold">Feb 15, 2025</div>
                <div className="text-xs text-green-500">On track</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all" data-testid="prediction-item-2">
              <div>
                <h4 className="font-medium">Full Launch</h4>
                <p className="text-sm text-muted-foreground">With all features</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-display font-semibold">Mar 30, 2025</div>
                <div className="text-xs text-yellow-500">At risk</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}