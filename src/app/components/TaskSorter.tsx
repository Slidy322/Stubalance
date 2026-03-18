import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SortedTask } from '../lib/types';
import { taskStore } from '../lib/taskStore';
import { Home, Plus, Trash2, Star, Clock, Calendar, TrendingUp } from 'lucide-react';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export function TaskSorter() {
  const navigate = useNavigate();
  const [sortedTasks, setSortedTasks] = useState<SortedTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('23:59');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [previewScore, setPreviewScore] = useState(0);

  useEffect(() => {
    const tasks = taskStore.getSortedTasks();
    setSortedTasks(tasks);
  }, []);

  // Calculate preview score whenever inputs change
  useEffect(() => {
    if (dueDate) {
      const score = taskStore.calculateTaskScore(dueDate, dueTime, difficulty);
      setPreviewScore(score);
    }
  }, [dueDate, dueTime, difficulty]);

  const addTask = () => {
    if (!taskTitle.trim()) {
      alert('Please enter a task name');
      return;
    }

    const score = taskStore.calculateTaskScore(dueDate, dueTime, difficulty);

    const newTask: SortedTask = {
      id: Date.now().toString(),
      title: taskTitle,
      dueDate,
      dueTime,
      difficulty,
      score,
      completed: false,
    };

    const updatedTasks = [...sortedTasks, newTask].sort((a, b) => b.score - a.score);
    
    // Recalculate all scores
    const recalculated = updatedTasks.map(task => ({
      ...task,
      score: taskStore.calculateTaskScore(task.dueDate, task.dueTime, task.difficulty)
    })).sort((a, b) => b.score - a.score);

    setSortedTasks(recalculated);
    taskStore.saveSortedTasks(recalculated);

    // Reset form
    setTaskTitle('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('23:59');
    setDifficulty('Medium');
  };

  const deleteTask = (taskId: string) => {
    const updated = sortedTasks.filter((t) => t.id !== taskId);
    setSortedTasks(updated);
    taskStore.saveSortedTasks(updated);
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'bg-[#dff3dc] text-[#2d5a2c]';
      case 'Medium':
        return 'bg-[#fff3d8] text-[#5a4a2c]';
      case 'Hard':
        return 'bg-[#ffe1e1] text-[#5a2c2c]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 100) return 'text-red-600';
    if (score >= 80) return 'text-orange-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-[#9d8a92]';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 100) return 'bg-red-500 text-white';
    if (score >= 80) return 'bg-orange-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    return 'bg-[#b4a0a8] text-white';
  };

  return (
    <div className="min-h-screen bg-[#fff5f5]">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#b4a0a8] text-center mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Task Sorter
          </h1>
          <p className="text-center text-[#a89099]">
            Add tasks, due dates, times, and difficulty. The app will automatically rank what you should do
            first.
          </p>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <div className="bg-[#e8d4d9] rounded-2xl p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[#7d6b73] font-bold mb-2">Task Name</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task name..."
                  className="w-full py-3 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7d6b73] font-bold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#7d6b73] font-bold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7d6b73] font-bold mb-3">Difficulty Level</label>
                <div className="flex flex-wrap gap-3">
                  {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        difficulty === diff
                          ? 'bg-[#b4a0a8] text-white'
                          : 'bg-white text-[#7d6b73] hover:bg-[#f5e6ea]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={addTask}
              className="w-full mt-6 bg-[#b4a0a8] hover:bg-[#9d8a92] text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task to Priority List
            </button>
          </div>
        </div>

        {/* Sorted Tasks List */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#b4a0a8] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Your Prioritized Tasks
          </h2>
          <p className="text-sm text-[#a89099] mb-6">
            Automatically sorted by urgency and difficulty
          </p>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#a89099] mb-4">No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="rounded-2xl overflow-hidden shadow-sm relative group"
                >
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100 z-10"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>

                  {/* Header */}
                  <div className="bg-[#b4a0a8] px-5 py-3 flex items-center justify-between">
                    <div className="text-white">
                      <p className="font-bold text-sm">Priority #{index + 1}</p>
                      <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                        <Clock className="w-3 h-3 ml-1" />
                        <span>{task.dueTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 rounded-full px-3 py-1">
                        <p className="text-xs text-white font-semibold">{task.difficulty}</p>
                      </div>
                      <Star className="w-5 h-5 text-white opacity-60" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#e8d4d9] px-5 py-6 pr-16">
                    <h3 className="text-lg font-semibold text-[#7d6b73] mb-2">{task.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white hover:bg-[#f5e6ea] text-[#b4a0a8] font-bold py-4 px-6 rounded-2xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Main Page
        </button>
      </div>
    </div>
  );
}