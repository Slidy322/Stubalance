import { supabase, isAuthEnabled } from './supabase';
import { Task, SortedTask } from '../app/lib/types';

// Tasks API
export const taskAPI = {
  // Fetch all tasks for the current user
  async getTasks(): Promise<Task[]> {
    if (!isAuthEnabled || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    // Convert database format to app format
    return (data || []).map(dbTask => ({
      id: dbTask.id,
      taskName: dbTask.task_name,
      subject: dbTask.subject,
      dueDate: dbTask.due_date,
      dueTime: dbTask.due_time || '',
      difficulty: dbTask.difficulty,
      status: dbTask.status || 'pending',
    }));
  },

  // Add a new task
  async addTask(task: Omit<Task, 'id'>): Promise<Task | null> {
    if (!isAuthEnabled || !supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        task_name: task.taskName,
        subject: task.subject,
        due_date: task.dueDate,
        due_time: task.dueTime || null,
        difficulty: task.difficulty,
        status: task.status || 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return null;
    }

    return {
      id: data.id,
      taskName: data.task_name,
      subject: data.subject,
      dueDate: data.due_date,
      dueTime: data.due_time || '',
      difficulty: data.difficulty,
      status: data.status,
    };
  },

  // Update an existing task
  async updateTask(id: string, updates: Partial<Task>): Promise<boolean> {
    if (!isAuthEnabled || !supabase) {
      return false;
    }

    const updateData: any = {};
    if (updates.taskName !== undefined) updateData.task_name = updates.taskName;
    if (updates.subject !== undefined) updateData.subject = updates.subject;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.dueTime !== undefined) updateData.due_time = updates.dueTime || null;
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      return false;
    }

    return true;
  },

  // Delete a task
  async deleteTask(id: string): Promise<boolean> {
    if (!isAuthEnabled || !supabase) {
      return false;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  },

  // Update sorted tasks with priority scores
  async updateSortedTasks(sortedTasks: SortedTask[]): Promise<boolean> {
    if (!isAuthEnabled || !supabase) {
      return false;
    }

    try {
      // Update each task with its priority score and urgency level
      const updates = sortedTasks.map(task => 
        supabase
          .from('tasks')
          .update({
            priority_score: task.priorityScore,
            urgency_level: task.urgencyLevel,
          })
          .eq('id', task.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error updating sorted tasks:', error);
      return false;
    }
  },
};

// Profile API
export const profileAPI = {
  // Get user profile
  async getProfile() {
    if (!isAuthEnabled || !supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching profile:', error);
      return null;
    }

    return data ? {
      name: data.name || '',
      gradeLevel: data.grade_level || '',
      school: data.school || '',
      email: data.email || '',
    } : null;
  },

  // Save user profile
  async saveProfile(profile: { name: string; gradeLevel: string; school: string; email: string }) {
    if (!isAuthEnabled || !supabase) {
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Try to update first, if it doesn't exist, insert
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        name: profile.name,
        grade_level: profile.gradeLevel,
        school: profile.school,
        email: profile.email,
      })
      .eq('user_id', user.id);

    if (updateError) {
      // If update failed, try insert
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          name: profile.name,
          grade_level: profile.gradeLevel,
          school: profile.school,
          email: profile.email,
        });

      if (insertError) {
        console.error('Error saving profile:', insertError);
        return false;
      }
    }

    return true;
  },
};

// Sync helper functions
export const syncHelpers = {
  // Sync local tasks to Supabase
  async syncLocalToCloud(localTasks: Task[]): Promise<void> {
    if (!isAuthEnabled || !supabase) {
      console.log('Sync skipped: Auth not enabled');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Sync skipped: No user');
      return;
    }

    try {
      // Get existing cloud tasks
      const cloudTasks = await taskAPI.getTasks();
      const cloudTaskIds = new Set(cloudTasks.map(t => t.id));

      // Add local tasks that don't exist in cloud
      for (const task of localTasks) {
        if (!cloudTaskIds.has(task.id)) {
          await taskAPI.addTask(task);
        }
      }

      console.log('Sync completed: Local → Cloud');
    } catch (error) {
      console.error('Sync error:', error);
    }
  },

  // Get merged tasks (cloud + local fallback)
  async getMergedTasks(): Promise<Task[]> {
    if (!isAuthEnabled || !supabase) {
      // Fall back to localStorage
      const stored = localStorage.getItem('stu-balance-tasks');
      return stored ? JSON.parse(stored) : [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Not logged in, use localStorage
      const stored = localStorage.getItem('stu-balance-tasks');
      return stored ? JSON.parse(stored) : [];
    }

    // Logged in, get from cloud
    return await taskAPI.getTasks();
  },
};
