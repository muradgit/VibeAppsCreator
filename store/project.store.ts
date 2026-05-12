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
  rawStreamingText: string;

  setProject: (project: Project) => void;
  setTasks: (tasks: Task[]) => void;
  setActiveTask: (taskId: string | null) => void;
  updateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  setAutomationMode: (mode: AutomationMode) => void;
  setRawStreamingText: (text: string) => void;
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
  rawStreamingText: '',

  setProject: (project) => set({ currentProject: project }),
  setTasks: (tasks) => set({ tasks }),
  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  updateTask: (taskId, updatedFields) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    ),
  })),

  setAutomationMode: (mode) => set({ automationMode: mode }),
  
  setRawStreamingText: (text) => set((state) => {
    // Basic parser for the stream format: ### FILE: path\ncode...
    const files: Record<string, string> = {};
    const parts = text.split(/### FILE: /);
    parts.forEach(part => {
        if (!part.trim()) return;
        const [filename, ...codeParts] = part.split('\n');
        files[filename.trim()] = codeParts.join('\n').trim();
    });
    return { 
        rawStreamingText: text,
        streamingCode: files 
    };
  }),

  clearStreamingCode: () => set({ streamingCode: {}, rawStreamingText: '' }),

  startAutomation: () => set({ isRunning: true }),
  pauseAutomation: () => set({ isRunning: false }),
}));
