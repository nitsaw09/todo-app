import { z } from "zod";

export const categories = ["Development", "Design", "Marketing", "Sales", "Support"] as const;
export const priorities = ["Low", "Medium", "High"] as const;
export const statuses = ["Completed", "InCompleted"] as const;

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.enum(categories, { message: "Invalid category selected" }),
  priority: z.enum(priorities, { message: "Invalid priority selected" }),
  status: z.enum(statuses, { message: "Invalid status selected" }),
});

export type TaskData = z.infer<typeof taskSchema>;