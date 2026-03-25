import { Task, SortedTask } from './types';
import { taskAPI, syncHelpers, profileAPI } from '../../lib/supabaseData';

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

// Helper: Calculate task score
const calculateTaskScore = (dueDate: string, dueTime: string, difficulty: 'Easy' | 'Medium' | 'Hard'): number => {
  const difficultyMap = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  try {
    // Get current time in UTC+8 (Philippines/Singapore/China timezone)
    const now = new Date();
    const utc8OffsetMs = 8 * 60 * 60 * 1000; // UTC+8 offset in milliseconds
    const localOffsetMs = now.getTimezoneOffset() * 60 * 1000; // Local timezone offset
    const utc8Now = new Date(now.getTime() + utc8OffsetMs + localOffsetMs);
    
    // Parse the due date and time in UTC+8
    // dueDate format: "YYYY-MM-DD"
    // dueTime format: "HH:MM" or "HH:MM:SS"
    const [year, month, day] = dueDate.split('-').map(Number);
    const [hours, minutes, seconds = 0] = (dueTime || '23:59').split(':').map(Number);
    
    // Create due date in UTC+8
    const due = new Date(year, month - 1, day, hours, minutes, seconds);
    
    // Calculate time difference in hours
    const timeLeft = (due.getTime() - utc8Now.getTime()) / (1000 * 60 * 60);

    let urgencyScore = 0;
    if (timeLeft <= 0) {
      urgencyScore = 100; // OVERDUE
    } else if (timeLeft <= 24) {
      urgencyScore = 90; // Very Urgent (< 24 hours)
    } else if (timeLeft <= 48) {
      urgencyScore = 70; // Urgent (< 48 hours)
    } else if (timeLeft <= 72) {
      urgencyScore = 50; // Medium (< 72 hours)
    } else if (timeLeft <= 168) {
      urgencyScore = 30; // Low (< 1 week)
    } else {
      urgencyScore = 10; // Very Low (> 1 week)
    }

    const difficultyScore = difficultyMap[difficulty] * 15;
    
    // IMPORTANT: For tasks with the same date, earlier times should be prioritized higher
    // Add a small time-based bonus (max 5 points) for earlier times in the day
    let timePriorityBonus = 0;
    if (dueTime) {
      const minutesFromMidnight = hours * 60 + minutes;
      // Earlier times get higher bonus (inverted scale)
      // 00:00 gets +5, 23:59 gets ~0
      timePriorityBonus = 5 * (1 - (minutesFromMidnight / (24 * 60)));
    }
    
    return urgencyScore + difficultyScore + timePriorityBonus;
  } catch (error) {
    console.error('Error calculating task score:', error);
    return 0;
  }
};

// Helper: Convert SortedTask to Supabase format
const sortedTaskToSupabase = (task: SortedTask): any => {
  // Map difficulty string to integer for database
  const difficultyMap: Record<string, number> = {
    'Easy': 1,
    'Medium': 2,
    'Hard': 3,
  };
  
  return {
    taskName: task.title,
    subject: 'General', // Default subject since SortedTask doesn't have this field
    dueDate: task.dueDate,
    dueTime: task.dueTime || '',
    difficulty: difficultyMap[task.difficulty] || 2, // Default to Medium (2) if not found
    status: task.completed ? 'completed' : 'pending',
  };
};

// Helper: Convert Supabase task to SortedTask format
const supabaseToSortedTask = (dbTask: any): SortedTask => {
  // Map difficulty integer back to string
  const difficultyMap: Record<number, 'Easy' | 'Medium' | 'Hard'> = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
  };
  
  const difficulty = difficultyMap[dbTask.difficulty] || 'Medium';
  const score = calculateTaskScore(
    dbTask.dueDate || dbTask.due_date,
    dbTask.dueTime || dbTask.due_time || '',
    difficulty
  );
  
  return {
    id: dbTask.id,
    title: dbTask.taskName || dbTask.task_name,
    dueDate: dbTask.dueDate || dbTask.due_date,
    dueTime: dbTask.dueTime || dbTask.due_time || '',
    difficulty: difficulty,
    score: score,
    completed: dbTask.status === 'completed',
  };
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

  // Load sorted tasks from cloud (for syncing on login)
  loadSortedTasksFromCloud: async (): Promise<SortedTask[]> => {
    try {
      const { supabase, isAuthEnabled } = await import('../../lib/supabase');
      if (!isAuthEnabled || !supabase) {
        return getFromStorage<SortedTask[]>(STORAGE_KEYS.SORTED_TASKS, []);
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return getFromStorage<SortedTask[]>(STORAGE_KEYS.SORTED_TASKS, []);
      }

      // Get all tasks from cloud
      const cloudTasks = await taskAPI.getTasks();
      
      // Convert to SortedTask format
      const sortedTasks = cloudTasks.map(supabaseToSortedTask);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEYS.SORTED_TASKS, sortedTasks);
      
      console.log(`Loaded ${sortedTasks.length} sorted tasks from cloud`);
      return sortedTasks;
    } catch (error) {
      console.error('Error loading sorted tasks from cloud:', error);
      return getFromStorage<SortedTask[]>(STORAGE_KEYS.SORTED_TASKS, []);
    }
  },

  saveSortedTasks: async (tasks: SortedTask[]): Promise<void> => {
    saveToStorage(STORAGE_KEYS.SORTED_TASKS, tasks);
    
    // Sync to cloud if auth is enabled
    try {
      const { supabase, isAuthEnabled } = await import('../../lib/supabase');
      if (!isAuthEnabled || !supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get existing cloud tasks
      const cloudTasks = await taskAPI.getTasks();
      const cloudTaskIds = new Set(cloudTasks.map(t => t.id));

      // For each sorted task, either create or update in cloud
      for (const task of tasks) {
        const supabaseTask = sortedTaskToSupabase(task);
        
        if (cloudTaskIds.has(task.id)) {
          // Update existing task
          await taskAPI.updateTask(task.id, supabaseTask);
        } else {
          // Create new task
          await taskAPI.addTask({ id: task.id, ...supabaseTask });
        }
      }
      
      console.log('Sorted tasks synced to cloud successfully');
    } catch (error) {
      console.error('Error syncing sorted tasks to cloud:', error);
    }
  },

  // Calculate task score
  calculateTaskScore: calculateTaskScore,
};