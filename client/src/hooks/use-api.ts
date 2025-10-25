import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type {
  Project, InsertProject, UpdateProject,
  Task, InsertTask, UpdateTask,
  Achievement, Activity, Settings, UpdateSettings,
  AIGoalBreakdownRequest, AIGoalBreakdownResponse,
} from '@shared/schema';
import { useAchievements } from '@/contexts/AchievementContext';

// Analytics
export function useAnalytics() {
  return useQuery<{
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    completionRate: number;
    totalAchievements: number;
  }>({
    queryKey: ['/api/analytics'],
  });
}

// Projects
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['/api/projects', id],
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { unlockAchievement } = useAchievements();

  return useMutation({
    mutationFn: async (data: InsertProject) => {
      return apiRequest<{ project: Project; achievements: Achievement[] }>('POST', '/api/projects', data);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      
      // Unlock achievements
      result.achievements?.forEach(achievement => {
        unlockAchievement(achievement);
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProject }) => {
      return apiRequest<Project>('PATCH', `/api/projects/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiRequest<void>('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    },
  });
}

// Tasks
export function useTasks(projectId?: string) {
  return useQuery<Task[]>({
    queryKey: projectId ? ['/api/tasks', projectId] : ['/api/tasks'],
    queryFn: async () => {
      const url = projectId ? `/api/tasks?projectId=${projectId}` : '/api/tasks';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { unlockAchievement } = useAchievements();

  return useMutation({
    mutationFn: async (data: InsertTask) => {
      return apiRequest<{ task: Task; achievements: Achievement[] }>('POST', '/api/tasks', data);
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      // Unlock achievements
      result.achievements?.forEach(achievement => {
        unlockAchievement(achievement);
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { unlockAchievement } = useAchievements();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTask }) => {
      return apiRequest<{ task: Task; achievements: Achievement[] }>('PATCH', `/api/tasks/${id}`, data);
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      // Unlock achievements
      result.achievements?.forEach(achievement => {
        unlockAchievement(achievement);
      });
    },
  });
}

// AI Goal Breakdown
export function useAIGoalBreakdown() {
  return useMutation({
    mutationFn: async (data: AIGoalBreakdownRequest) => {
      return apiRequest<AIGoalBreakdownResponse>('POST', '/api/ai/goal-breakdown', data);
    },
  });
}

export function useCreateProjectFromAI() {
  const queryClient = useQueryClient();
  const { unlockAchievement } = useAchievements();

  return useMutation({
    mutationFn: async (breakdown: AIGoalBreakdownResponse) => {
      return apiRequest<{ project: Project; tasks: Task[]; achievements: Achievement[] }>('POST', '/api/ai/create-project', { breakdown });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      // Unlock achievements
      result.achievements?.forEach(achievement => {
        unlockAchievement(achievement);
      });
    },
  });
}

// Achievements
export function useAchievementsList() {
  return useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });
}

// Activities
export function useActivities(limit?: number) {
  return useQuery<Activity[]>({
    queryKey: limit ? ['/api/activities', limit] : ['/api/activities'],
    queryFn: async () => {
      const url = limit ? `/api/activities?limit=${limit}` : '/api/activities';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
  });
}

// Settings
export function useSettings() {
  return useQuery<Settings>({
    queryKey: ['/api/settings'],
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettings) => {
      return apiRequest<Settings>('PATCH', '/api/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
  });
}
