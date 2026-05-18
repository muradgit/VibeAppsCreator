"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { PlanView } from "@/components/plan/PlanView";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function PlanPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
            setProject(await res.json());
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!project?.plan) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Plan Not Generated</h2>
              <p className="text-slate-500 max-w-md">The architectural plan has not been synthesized yet. Please complete the requirement analysis first.</p>
              <Button variant="outline" asChild>
                  <Link href={`/project/${id}/analysis`}>Back to Analysis</Link>
              </Button>
          </div>
      )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full bg-slate-50"
    >
      <ErrorBoundary>
        <PlanView plan={project.plan} projectId={id as string} />
      </ErrorBoundary>
    </motion.div>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";
