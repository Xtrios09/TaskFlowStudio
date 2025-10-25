import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Timeline() {
  return (
    <div className="p-8 space-y-8 animate-fade-in-up" data-testid="page-timeline">
      <div>
        <h1 className="text-4xl font-display font-bold">Timeline</h1>
        <p className="text-muted-foreground mt-2">
          Gantt chart view of your project schedule
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Project Timeline</CardTitle>
          <CardDescription>Coming soon - interactive Gantt chart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Timeline view will be implemented in Phase 2
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
