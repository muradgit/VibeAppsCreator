"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { TaskAutomationDashboard } from "@/components/tasks/TaskAutomationDashboard";
import { Loader2 } from "lucide-react";

export default function ProjectTasksPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
        const [projRes, tasksRes] = await Promise.all([
            fetch(`/api/projects/${id}`),
            fetch(`/api/projects/${id}/tasks`)
        ]);
        
        if (projRes.ok && tasksRes.ok) {
            setProject(await projRes.json());
            setTasks(await tasksRes.json());
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <TaskAutomationDashboard 
        initialTasks={tasks} 
        initialProject={project}
        onRefresh={fetchData}
    />
  );
}
