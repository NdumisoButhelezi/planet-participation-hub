
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  email: string;
  skillLevel: SkillLevel;
  isAdmin?: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  skillLevel: SkillLevel;
}
