import { create } from 'zustand';
import { Project, Task } from '@/types';

type AutomationMode = 'manual' | 'semi' | 'full';

interface ProjectStore {
  currentProject: Project | null;
  tasks: Task[];
  activeTaskId: string | null;
  automationMode: AutomationMode;
  isRunning: boolean;
  streamingCode: Record<string, string>;

  setProject: (project: Project) => void;
  setTasks: (tasks: Task[]) => void;
  setActiveTask: (taskId: string | null) => void;
  updateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  setAutomationMode: (mode: AutomationMode) => void;
  setStreamingCodeForFile: (filename: string, code: string) => void;
  appendStreamingCodeForFile: (filename: string, chunk: string) => void;
  clearStreamingCode: () => void;
  startAutomation: () => void;
  pauseAutomation: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  tasks: [],
  activeTaskId: null,
  automationMode: 'manual',
  isRunning: false,
  streamingCode: {},

  setProject: (project) => set({ currentProject: project }),
  setTasks: (tasks) => set({ tasks }),
  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  updateTask: (taskId, updatedFields) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    ),
  })),

  setAutomationMode: (mode) => set({ automationMode: mode }),
  
  setStreamingCodeForFile: (filename, code) => set((state) => ({
    streamingCode: { ...state.streamingCode, [filename]: code }
  })),

  appendStreamingCodeForFile: (filename, chunk) => set((state) => ({
    streamingCode: {
      ...state.streamingCode,
      [filename]: (state.streamingCode[filename] || '') + chunk,
    }
  })),

  clearStreamingCode: () => set({ streamingCode: {} }),

  startAutomation: () => set({ isRunning: true }),
  pauseAutomation: () => set({ isRunning: false }),
}));
