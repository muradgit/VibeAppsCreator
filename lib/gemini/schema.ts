import { z } from "zod";

export const AnalysisResponseSchema = z.object({
  summary: z.string(),
  inconsistencies: z.array(z.string()),
  similarProducts: z.array(z.object({
    name: z.string(),
    url: z.string(),
    description: z.string()
  })),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    why: z.string()
  }))
});

export const PlanResponseSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  techStack: z.array(z.object({
    name: z.string(),
    rationale: z.string()
  })),
  constraints: z.array(z.object({
    item: z.string(),
    reason: z.string()
  })),
  designGuide: z.object({
    colors: z.array(z.string()),
    typography: z.string(),
    tone: z.string()
  }),
  developerGuide: z.object({
    conventions: z.string(),
    folderStructure: z.string(),
    patterns: z.string()
  }),
  phases: z.array(z.object({
    name: z.string(),
    tasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      acceptanceCriteria: z.array(z.string()),
      filePaths: z.array(z.string()),
      estimatedComplexity: z.enum(["easy", "medium", "hard"]),
      dependsOn: z.array(z.string())
    }))
  }))
});

export const ReviewResponseSchema = z.object({
  score: z.number(),
  status: z.enum(["done", "issues"]),
  verdict: z.string(),
  issues: z.array(z.object({
    severity: z.enum(["critical", "high", "medium", "low"]),
    location: z.string(),
    problem: z.string(),
    fix: z.string()
  })),
  missingRequirements: z.array(z.string()),
  completedCriteria: z.array(z.string())
});
