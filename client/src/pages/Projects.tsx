import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Projects() {
  return (
    <div className="p-8 space-y-8 animate-fade-in-up" data-testid="page-projects">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your projects with Kanban boards
          </p>
        </div>
        <Button data-testid="button-new-project">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Kanban Board</CardTitle>
          <CardDescription>Coming soon - drag and drop task management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Kanban board will be implemented in Phase 2
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
