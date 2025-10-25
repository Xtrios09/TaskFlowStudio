import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useAnalytics, useProjects } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: typeof CheckCircle2;
  trend?: { value: number; isPositive: boolean };
  progress?: number;
}

function AnalyticsCard({ title, value, description, icon: Icon, trend, progress }: AnalyticsCardProps) {
  return (
    <Card className="hover-elevate transition-all" data-testid={`card-analytics-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display font-bold" data-testid={`text-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-2" />
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: analyticsData, isLoading } = useAnalytics();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const analytics = analyticsData ? [
    {
      title: 'Total Tasks',
      value: analyticsData.totalTasks,
      description: 'Across all projects',
      icon: CheckCircle2,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'In Progress',
      value: analyticsData.inProgressTasks,
      description: 'Currently active',
      icon: Clock,
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Completion Rate',
      value: `${analyticsData.completionRate}%`,
      description: 'Overall progress',
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
      progress: analyticsData.completionRate,
    },
    {
      title: 'Total Projects',
      value: analyticsData.totalProjects,
      description: `${analyticsData.activeProjects} active`,
      icon: Sparkles,
    },
  ] : [];

  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted/50 rounded-lg shimmer" />
          <div className="h-5 w-96 bg-muted/30 rounded shimmer" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 bg-muted/50 rounded shimmer" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted/50 rounded shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in-up" data-testid="dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent gradient-animate">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your projects and productivity
          </p>
        </div>
        <Button onClick={() => setLocation('/ai-insights')} data-testid="button-get-started">
          <Plus className="w-4 h-4 mr-2" />
          Get Started
        </Button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analytics.map((card) => (
          <AnalyticsCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Projects Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Projects</CardTitle>
          <CardDescription>Your most recently updated projects</CardDescription>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/30 rounded-lg shimmer" />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate transition-all cursor-pointer"
                  onClick={() => setLocation(`/projects`)}
                  data-testid={`project-preview-${project.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="w-24 h-2" />
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setLocation('/ai-insights')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/30 hover-elevate transition-all cursor-pointer" onClick={() => setLocation('/ai-insights')} data-testid="card-quick-action-ai">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">AI Goal Breakdown</CardTitle>
                <CardDescription>Transform goals into tasks instantly</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-accent/30 hover-elevate transition-all cursor-pointer" onClick={() => setLocation('/settings')} data-testid="card-quick-action-settings">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="font-display">Settings</CardTitle>
                <CardDescription>Customize themes and AI preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
