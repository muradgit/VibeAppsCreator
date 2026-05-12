"use client";

import { useParams } from "next/navigation";
import { PlanView } from "@/components/plan/PlanView";

export default function PlanPage() {
  const { id } = useParams();
  
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <PlanView projectId={id as string} />
    </div>
  );
}
