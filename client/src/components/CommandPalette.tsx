import { useEffect, useState, useCallback } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  FolderKanban,
  GanttChart,
  Users,
  Sparkles,
  Settings,
  Plus,
  Search,
  Palette,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useTheme, themes } from '@/contexts/ThemeContext';

interface Command {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

  const navigationCommands: Command[] = [
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => setLocation('/'),
      category: 'Navigation',
    },
    {
      id: 'nav-projects',
      label: 'Go to Projects',
      icon: FolderKanban,
      action: () => setLocation('/projects'),
      category: 'Navigation',
    },
    {
      id: 'nav-timeline',
      label: 'Go to Timeline',
      icon: GanttChart,
      action: () => setLocation('/timeline'),
      category: 'Navigation',
    },
    {
      id: 'nav-team',
      label: 'Go to Team',
      icon: Users,
      action: () => setLocation('/team'),
      category: 'Navigation',
    },
    {
      id: 'nav-ai',
      label: 'Go to AI Insights',
      icon: Sparkles,
      action: () => setLocation('/ai-insights'),
      category: 'Navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      icon: Settings,
      action: () => setLocation('/settings'),
      category: 'Navigation',
    },
  ];

  const actionCommands: Command[] = [
    {
      id: 'action-new-project',
      label: 'Create New Project',
      icon: Plus,
      action: () => setLocation('/ai-insights'),
      category: 'Actions',
    },
    {
      id: 'action-new-task',
      label: 'Create New Task',
      icon: Plus,
      action: () => setLocation('/ai-insights'),
      category: 'Actions',
    },
    {
      id: 'action-search',
      label: 'Search Everything',
      icon: Search,
      action: () => setLocation('/projects'),
      category: 'Actions',
    },
  ];

  const themeCommands: Command[] = themes.map((theme) => ({
    id: `theme-${theme.value}`,
    label: `Switch to ${theme.label}`,
    icon: Palette,
    action: () => setTheme(theme.value),
    category: 'Theme',
  }));

  const allCommands = [...navigationCommands, ...actionCommands, ...themeCommands];
  const categories = [...new Set(allCommands.map((cmd) => cmd.category))];

  return (
    <>
      {/* Trigger hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md hover-elevate active-elevate-2 transition-all"
        data-testid="button-command-palette-trigger"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-xs font-medium opacity-70">
          <span className="text-xs">⌘</span>P
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." data-testid="input-command-search" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((category, idx) => {
            const commands = allCommands.filter((cmd) => cmd.category === category);
            return (
              <div key={category}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={category}>
                  {commands.map((command) => {
                    const Icon = command.icon;
                    return (
                      <CommandItem
                        key={command.id}
                        onSelect={() => handleSelect(command.action)}
                        data-testid={`command-${command.id}`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{command.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
