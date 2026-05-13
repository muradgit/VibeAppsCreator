"use client";

import { useProjectStore } from "@/store/project.store";
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { activeTaskId, setActiveTask } = useProjectStore();

  return (
    <div className="w-[380px] border-r bg-slate-50 flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b bg-white">
        <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full px-3 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isActive={activeTaskId === task.id} 
            onClick={() => setActiveTask(task.id)} 
          />
        ))}
      </div>
    </div>
  );
}

