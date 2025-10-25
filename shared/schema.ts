import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, completed, archived
  priority: text("priority").notNull().default("medium"), // urgent, high, medium, low, planning
  color: text("color").notNull().default("blue"), // for color coding
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  progress: integer("progress").notNull().default(0), // 0-100
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("backlog"), // backlog, todo, in_progress, review, done
  priority: text("priority").notNull().default("medium"), // urgent, high, medium, low, planning
  assignee: text("assignee"), // team member name
  dueDate: timestamp("due_date"),
  estimatedHours: integer("estimated_hours"),
  tags: text("tags").array().default(sql`ARRAY[]::text[]`),
  emoji: text("emoji"), // optional emoji for the task
  parentTaskId: varchar("parent_task_id"), // for sub-tasks
  order: integer("order").notNull().default(0), // for ordering in kanban
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"), // for future multi-user support
  type: text("type").notNull(), // first_task, first_project, ten_day_streak, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // trophy, star, medal, fire, etc.
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  progress: integer("progress").default(0), // for progressive achievements
  total: integer("total").default(1), // total required for achievement
});

// Activity Feed table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // task_created, task_completed, project_created, ai_suggestion, etc.
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  entityId: varchar("entity_id"), // reference to task/project id
  entityType: text("entity_type"), // task, project, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Settings table
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"),
  theme: text("theme").notNull().default("dark-gradient"), // dark-gradient, minimalist-light, cyberpunk-neon, studio-professional
  aiProvider: text("ai_provider").notNull().default("huggingface"), // huggingface, openrouter
  openRouterApiKey: text("open_router_api_key"), // optional
  tutorialCompleted: boolean("tutorial_completed").notNull().default(false),
  preferences: jsonb("preferences").default(sql`'{}'::jsonb`), // for future customization
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// AI Insights table (cached insights)
export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  healthScore: integer("health_score").notNull().default(80), // 0-100
  bottlenecks: text("bottlenecks").array().default(sql`ARRAY[]::text[]`),
  optimizations: text("optimizations").array().default(sql`ARRAY[]::text[]`),
  predictions: jsonb("predictions").default(sql`'{}'::jsonb`),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertAIInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  generatedAt: true,
});

// Update schemas
export const updateProjectSchema = insertProjectSchema.partial();
export const updateTaskSchema = insertTaskSchema.partial();
export const updateSettingsSchema = insertSettingsSchema.partial();

// AI Goal Breakdown Request/Response
export const aiGoalBreakdownRequestSchema = z.object({
  goal: z.string().min(10).max(1000),
  context: z.string().optional(),
  provider: z.enum(["huggingface", "openrouter"]).default("huggingface"),
  model: z.string().optional(),
});

export const aiTaskBreakdownSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["urgent", "high", "medium", "low", "planning"]),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    estimatedHours: z.number().optional(),
  })).optional(),
});

export const aiGoalBreakdownResponseSchema = z.object({
  projectTitle: z.string(),
  projectDescription: z.string(),
  tasks: z.array(aiTaskBreakdownSchema),
  estimatedTotalHours: z.number().optional(),
  milestones: z.array(z.object({
    title: z.string(),
    dueDate: z.string().optional(),
    tasks: z.array(z.string()), // task titles
  })).optional(),
});

// Types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;

export type InsertAIInsight = z.infer<typeof insertAIInsightSchema>;
export type AIInsight = typeof aiInsights.$inferSelect;

export type AIGoalBreakdownRequest = z.infer<typeof aiGoalBreakdownRequestSchema>;
export type AITaskBreakdown = z.infer<typeof aiTaskBreakdownSchema>;
export type AIGoalBreakdownResponse = z.infer<typeof aiGoalBreakdownResponseSchema>;

// Priority color mapping (for UI)
export const priorityColors = {
  urgent: "red",
  high: "orange",
  medium: "yellow",
  low: "green",
  planning: "blue",
} as const;

// Status color mapping (for UI)
export const statusColors = {
  backlog: "gray",
  todo: "blue",
  in_progress: "purple",
  review: "orange",
  done: "green",
} as const;
