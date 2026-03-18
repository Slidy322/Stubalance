import { Task, SortedTask } from './types';

const STORAGE_KEYS = {
  TODAY_TASKS: 'stu-balance-today-tasks',
  WEEK_TASKS: 'stu-balance-week-tasks',
  SORTED_TASKS: 'stu-balance-sorted-tasks',
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

  saveSortedTasks: (tasks: SortedTask[]): void => {
    saveToStorage(STORAGE_KEYS.SORTED_TASKS, tasks);
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