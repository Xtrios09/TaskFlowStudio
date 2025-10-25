import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderKanban,
  GanttChart,
  Users,
  Sparkles,
  Settings,
  Github,
  Star,
} from 'lucide-react';
import { useLocation } from 'wouter';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Timeline',
    url: '/timeline',
    icon: GanttChart,
  },
  {
    title: 'Team',
    url: '/team',
    icon: Users,
  },
  {
    title: 'AI Insights',
    url: '/ai-insights',
    icon: Sparkles,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">TaskFlow</h2>
            <p className="text-xs text-muted-foreground">Studio</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.url)}
                    isActive={location === item.url}
                    data-testid={`link-sidebar-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <a
          href="https://github.com/Xtrios09"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 transition-all text-sm"
          data-testid="link-github-developer"
        >
          <Github className="w-4 h-4" />
          <span className="flex-1">Built by Xtrios09</span>
          <Star className="w-4 h-4 text-muted-foreground" />
        </a>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Star on GitHub
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
