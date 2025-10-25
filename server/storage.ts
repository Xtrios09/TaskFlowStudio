import {
  type Project, type InsertProject, type UpdateProject,
  type Task, type InsertTask, type UpdateTask,
  type Achievement, type InsertAchievement,
  type Activity, type InsertActivity,
  type Settings, type InsertSettings, type UpdateSettings,
  type AIInsight, type InsertAIInsight,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Tasks
  getTasks(projectId?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  bulkCreateTasks(tasks: InsertTask[]): Promise<Task[]>;

  // Achievements
  getAchievements(userId?: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  checkAndUnlockAchievements(userId: string): Promise<Achievement[]>;

  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Settings
  getSettings(userId?: string): Promise<Settings | undefined>;
  updateSettings(userId: string, settings: UpdateSettings): Promise<Settings>;

  // AI Insights
  getAIInsight(projectId: string): Promise<AIInsight | undefined>;
  createAIInsight(insight: InsertAIInsight): Promise<AIInsight>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private achievements: Map<string, Achievement>;
  private activities: Map<string, Activity>;
  private settings: Map<string, Settings>;
  private aiInsights: Map<string, AIInsight>;

  constructor() {
    this.projects = new Map();
    this.tasks = new Map();
    this.achievements = new Map();
    this.activities = new Map();
    this.settings = new Map();
    this.aiInsights = new Map();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    
    // Create activity
    await this.createActivity({
      type: 'project_created',
      title: 'Project Created',
      description: `Created project: ${project.title}`,
      icon: 'folder',
      entityId: id,
      entityType: 'project',
    });
    
    return project;
  }

  async updateProject(id: string, updateProject: UpdateProject): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...updateProject,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Tasks
  async getTasks(projectId?: string): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    return tasks.sort((a, b) => a.order - b.order);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    
    // Create activity
    await this.createActivity({
      type: 'task_created',
      title: 'Task Created',
      description: `Created task: ${task.title}`,
      icon: 'check-circle',
      entityId: id,
      entityType: 'task',
    });
    
    return task;
  }

  async updateTask(id: string, updateTask: UpdateTask): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...updateTask,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);

    // Check if task was completed
    if (updated.status === 'done' && existing.status !== 'done') {
      await this.createActivity({
        type: 'task_completed',
        title: 'Task Completed',
        description: `Completed task: ${updated.title}`,
        icon: 'check-circle',
        entityId: id,
        entityType: 'task',
      });
    }
    
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async bulkCreateTasks(insertTasks: InsertTask[]): Promise<Task[]> {
    const tasks: Task[] = [];
    for (const insertTask of insertTasks) {
      const task = await this.createTask(insertTask);
      tasks.push(task);
    }
    return tasks;
  }

  // Achievements
  async getAchievements(userId: string = 'default_user'): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];
    const userAchievements = await this.getAchievements(userId);
    const tasks = Array.from(this.tasks.values());
    const projects = Array.from(this.projects.values());

    // First Task Achievement
    if (tasks.length === 1 && !userAchievements.some(a => a.type === 'first_task')) {
      newAchievements.push(await this.createAchievement({
        userId,
        type: 'first_task',
        title: 'First Steps',
        description: 'Created your first task',
        icon: 'star',
      }));
    }

    // First Project Achievement
    if (projects.length === 1 && !userAchievements.some(a => a.type === 'first_project')) {
      newAchievements.push(await this.createAchievement({
        userId,
        type: 'first_project',
        title: 'Project Pioneer',
        description: 'Created your first project',
        icon: 'trophy',
      }));
    }

    // Task Completionist
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    if (completedTasks >= 10 && !userAchievements.some(a => a.type === 'task_completionist')) {
      newAchievements.push(await this.createAchievement({
        userId,
        type: 'task_completionist',
        title: 'Task Completionist',
        description: 'Completed 10 tasks',
        icon: 'medal',
      }));
    }

    return newAchievements;
  }

  // Activities
  async getActivities(limit: number = 50): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Settings
  async getSettings(userId: string = 'default_user'): Promise<Settings | undefined> {
    return Array.from(this.settings.values()).find(s => s.userId === userId);
  }

  async updateSettings(userId: string, updateSettings: UpdateSettings): Promise<Settings> {
    let existing = await this.getSettings(userId);
    
    if (!existing) {
      // Create default settings
      const id = randomUUID();
      existing = {
        id,
        userId,
        theme: 'dark-gradient',
        aiProvider: 'huggingface',
        openRouterApiKey: null,
        tutorialCompleted: false,
        preferences: {},
        updatedAt: new Date(),
      };
      this.settings.set(id, existing);
    }

    const updated: Settings = {
      ...existing,
      ...updateSettings,
      updatedAt: new Date(),
    };
    this.settings.set(updated.id, updated);
    return updated;
  }

  // AI Insights
  async getAIInsight(projectId: string): Promise<AIInsight | undefined> {
    return Array.from(this.aiInsights.values()).find(i => i.projectId === projectId);
  }

  async createAIInsight(insertInsight: InsertAIInsight): Promise<AIInsight> {
    const id = randomUUID();
    const insight: AIInsight = {
      ...insertInsight,
      id,
      generatedAt: new Date(),
    };
    this.aiInsights.set(id, insight);
    return insight;
  }
}

export const storage = new MemStorage();
