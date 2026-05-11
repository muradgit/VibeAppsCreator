"use client";

import { useParams } from "next/navigation";
import { TaskAutomationDashboard } from "@/components/tasks/TaskAutomationDashboard";
import { Task, Project } from "@/types";

// Mock data for initial turn
const MOCK_PROJECT: Project = {
    id: "1",
    user_id: "user_1",
    name: "E-Commerce Multi-Vendor Platform",
    idea_raw: "A marketplace like Etsy but for tech gadgets.",
    idea_refined: null,
    plan: null,
    tech_stack: null,
    constraints: null,
    status: "active",
    github_repo: null,
    vercel_project_id: null,
    github_token_encrypted: null,
    vercel_token_encrypted: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const MOCK_TASKS: Task[] = [
    {
        id: "task_1",
        project_id: "1",
        sequence_number: 1,
        title: "Database Schema Design",
        description: "Define the core entities for products, vendors, and orders using Supabase migration syntax.",
        acceptance_criteria: ["SQL file generated", "Auth tables linked", "RLS policies included"],
        file_paths: ["/supabase/migrations/core_schema.sql"],
        dependencies: [],
        generated_prompt: null,
        generated_code: null,
        review_result: null,
        status: "done",
        retry_count: 0,
        github_commit_sha: "abc123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "task_2",
        project_id: "1",
        sequence_number: 2,
        title: "Vendor Authentication Flow",
        description: "Implement custom sign-up and onboarding for vendors with profile completion.",
        acceptance_criteria: ["NextAuth callback configured", "Profile form validation", "KYC state handled"],
        file_paths: ["/app/api/auth/[...nextauth]/route.ts", "/components/auth/VendorSignup.tsx"],
        dependencies: ["task_1"],
        generated_prompt: null,
        generated_code: null,
        review_result: {
            score: 94,
            status: 'done',
            verdict: "Logic is sound, minor accessibility improvements suggested.",
            issues: [
                { severity: 'low', location: 'VendorSignup.tsx', problem: 'Missing aria-labels on inputs', fix: 'Add aria-label to email and business name fields.' }
            ],
            missingRequirements: [],
            completedCriteria: ["NextAuth callback configured", "Profile form validation"]
        },
        status: "pending",
        retry_count: 0,
        github_commit_sha: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export default function ProjectTasksPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <TaskAutomationDashboard 
        initialTasks={MOCK_TASKS} 
        initialProject={{ ...MOCK_PROJECT, id }} 
    />
  );
}
