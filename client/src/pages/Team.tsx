import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Team() {
  return (
    <div className="p-8 space-y-8 animate-fade-in-up" data-testid="page-team">
      <div>
        <h1 className="text-4xl font-display font-bold">Team</h1>
        <p className="text-muted-foreground mt-2">
          View team performance and collaboration metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Team Performance</CardTitle>
          <CardDescription>Coming soon - team analytics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Team view will be implemented in Phase 2
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
