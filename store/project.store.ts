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
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  setAutomationMode: (mode: AutomationMode) => void;
  setRawStreamingText: (text: string) => void;
  setStreamingCode: (text: string) => void;
  appendStreamingCode: (chunk: string) => void;
  clearStreamingCode: () => void;
  startAutomation: () => void;
  pauseAutomation: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
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

  updateTaskStatus: (taskId, status) => {
    get().updateTask(taskId, { status });
  },

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

  setStreamingCode: (text) => {
    get().setRawStreamingText(text);
  },

  appendStreamingCode: (chunk) => {
    const newText = get().rawStreamingText + chunk;
    get().setRawStreamingText(newText);
  },

  clearStreamingCode: () => set({ streamingCode: {}, rawStreamingText: '' }),

  startAutomation: () => set({ isRunning: true }),
  pauseAutomation: () => set({ isRunning: false }),
}));
