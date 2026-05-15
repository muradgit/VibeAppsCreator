"use client";

import { useParams } from "next/navigation";
import { PlanView } from "@/components/plan/PlanView";
import { motion } from "framer-motion";

export default function PlanPage() {
  const { id } = useParams();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950"
    >
      <PlanView projectId={id as string} />
    </motion.div>
  );
}
