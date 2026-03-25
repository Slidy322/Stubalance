import { Task, SortedTask } from './types';
import { taskAPI, syncHelpers } from '../../lib/supabaseData';

const STORAGE_KEYS = {
  TODAY_TASKS: 'stu-balance-today-tasks',
  WEEK_TASKS: 'stu-balance-week-tasks',
  SORTED_TASKS: 'stu-balance-sorted-tasks',
  ALL_TASKS: 'stu-balance-tasks',
};

// Helper function to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const taskStore = {
  // Get all tasks (cloud-synced or local)
  getAllTasks: async (): Promise<Task[]> => {
    const tasks = await syncHelpers.getMergedTasks();
    // Also save to localStorage as backup
    saveToStorage(STORAGE_KEYS.ALL_TASKS, tasks);
    return tasks;
  },

  // Add a task (syncs to cloud if authenticated)
  addTask: async (task: Task): Promise<boolean> => {
    try {
      // Try to add to cloud first
      const cloudTask = await taskAPI.addTask(task);
      
      if (cloudTask) {
        // Success - cloud is source of truth
        return true;
      } else {
        // Not authenticated or failed - use localStorage
        const tasks = getFromStorage<Task[]>(STORAGE_KEYS.ALL_TASKS, []);
        tasks.push(task);
        saveToStorage(STORAGE_KEYS.ALL_TASKS, tasks);
        return true;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  },

  // Update a task (syncs to cloud if authenticated)
  updateTask: async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      // Try to update in cloud first
      const success = await taskAPI.updateTask(id, updates);
      
      if (success) {
        return true;
      } else {
        // Not authenticated or failed - use localStorage
        const tasks = getFromStorage<Task[]>(STORAGE_KEYS.ALL_TASKS, []);
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...updates };
          saveToStorage(STORAGE_KEYS.ALL_TASKS, tasks);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  },

  // Delete a task (syncs to cloud if authenticated)
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      // Try to delete from cloud first
      const success = await taskAPI.deleteTask(id);
      
      if (success) {
        return true;
      } else {
        // Not authenticated or failed - use localStorage
        const tasks = getFromStorage<Task[]>(STORAGE_KEYS.ALL_TASKS, []);
        const filtered = tasks.filter(t => t.id !== id);
        saveToStorage(STORAGE_KEYS.ALL_TASKS, filtered);
        return true;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Today's tasks
  getTodayTasks: (): Task[] => {
    return getFromStorage<Task[]>(STORAGE_KEYS.TODAY_TASKS, []);
  },

  saveTodayTasks: (tasks: Task[]): void => {
    saveToStorage(STORAGE_KEYS.TODAY_TASKS, tasks);
  },

  // Week tasks
  getWeekTasks: (): Task[] => {
    return getFromStorage<Task[]>(STORAGE_KEYS.WEEK_TASKS, []);
  },

  saveWeekTasks: (tasks: Task[]): void => {
    saveToStorage(STORAGE_KEYS.WEEK_TASKS, tasks);
  },

  // Sorted tasks
  getSortedTasks: (): SortedTask[] => {
    return getFromStorage<SortedTask[]>(STORAGE_KEYS.SORTED_TASKS, []);
  },

  saveSortedTasks: async (tasks: SortedTask[]): Promise<void> => {
    saveToStorage(STORAGE_KEYS.SORTED_TASKS, tasks);
    // Also sync to cloud
    await taskAPI.updateSortedTasks(tasks);
  },

  // Calculate task score
  calculateTaskScore: (dueDate: string, dueTime: string, difficulty: 'Easy' | 'Medium' | 'Hard'): number => {
    const difficultyMap = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };

    try {
      // Combine date and time for accurate calculation
      const dueDateTimeString = `${dueDate}T${dueTime || '23:59'}`;
      const due = new Date(dueDateTimeString);
      const now = new Date();
      const timeLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60); // hours

      let urgencyScore = 0;
      if (timeLeft <= 0) {
        urgencyScore = 100;
      } else if (timeLeft <= 24) {
        urgencyScore = 90;
      } else if (timeLeft <= 48) {
        urgencyScore = 70;
      } else if (timeLeft <= 72) {
        urgencyScore = 50;
      } else if (timeLeft <= 168) {
        urgencyScore = 30;
      } else {
        urgencyScore = 10;
      }

      const difficultyScore = difficultyMap[difficulty] * 15;
      return urgencyScore + difficultyScore;
    } catch {
      return 0;
    }
  },
};