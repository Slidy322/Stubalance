export interface Task {
  id: string;
  title: string;
  time: string;
  date: string;
  completed?: boolean;
}

export interface SortedTask {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  completed?: boolean;
}