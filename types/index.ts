import { Database } from "@/lib/supabase/types";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Project = Tables<'projects'>;
export type Task = Tables<'tasks'>;
export type Conversation = Tables<'conversations'>;
export type TaskComment = Tables<'task_comments'>;

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'done' | 'failed';

export type CodeReview = {
  score: number;
  status: 'done' | 'issues';
  verdict: string;
  issues: {
    severity: 'critical' | 'high' | 'medium' | 'low';
    location: string;
    problem: string;
    fix: string;
  }[];
  missingRequirements: string[];
  completedCriteria: string[];
};
