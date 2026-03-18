import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, Calendar, Clock, Star } from 'lucide-react';
import { Task, SortedTask } from '../lib/types';
import { taskStore } from '../lib/taskStore';

type FilterType = 'Active' | 'All' | 'Done';

export function MyTask() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('Active');
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const [sortedTasks, setSortedTasks] = useState<SortedTask[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const today = taskStore.getTodayTasks();
    const week = taskStore.getWeekTasks();
    const sorted = taskStore.getSortedTasks();
    
    setTodayTasks(today);
    setWeekTasks(week);
    setSortedTasks(sorted);
  };

  const getAllTasks = () => {
    // Combine all tasks with a type indicator
    const all = [
      ...todayTasks.map(t => ({ ...t, type: 'today' as const })),
      ...weekTasks.map(t => ({ ...t, type: 'week' as const })),
      ...sortedTasks.map(t => ({ ...t, type: 'sorted' as const })),
    ];
    
    return all;
  };

  const getFilteredTasks = () => {
    const all = getAllTasks();
    
    if (filter === 'Active') {
      return all.filter(t => !t.completed);
    } else if (filter === 'Done') {
      return all.filter(t => t.completed);
    }
    return all;
  };

  const toggleTaskComplete = (taskId: string, taskType: 'today' | 'week' | 'sorted') => {
    if (taskType === 'today') {
      const updated = todayTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      setTodayTasks(updated);
      taskStore.saveTodayTasks(updated);
    } else if (taskType === 'week') {
      const updated = weekTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      setWeekTasks(updated);
      taskStore.saveWeekTasks(updated);
    } else {
      const updated = sortedTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      setSortedTasks(updated);
      taskStore.saveSortedTasks(updated);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-[#f5e0e8]">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-14 h-14 rounded-full bg-[#c4a5b9] hover:bg-[#b495a9] flex items-center justify-center text-white transition-colors duration-200 shadow-sm"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#b4a0a8] leading-tight" style={{ fontFamily: 'Brush Script MT, cursive', fontStyle: 'italic' }}>
              My Task
            </h1>
            <p className="text-[#d4a5b9] text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
              Calendar
            </p>
          </div>

          <button
            onClick={() => navigate('/task-sorter')}
            className="w-14 h-14 rounded-full bg-[#c4a5b9] hover:bg-[#b495a9] flex items-center justify-center text-white transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-[#c4a5b9] rounded-full p-2 mb-8 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {(['Active', 'All', 'Done'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-white text-[#7d6b73] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#c4b0b8] text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                No {filter.toLowerCase()} tasks
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSorted = task.type === 'sorted';
              const sortedTask = isSorted ? task as SortedTask : null;
              
              return (
                <div
                  key={task.id}
                  className="rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Header */}
                  <div className="bg-[#b4a0a8] px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id, task.type)}
                        className="flex-shrink-0"
                      >
                        <div className={`w-5 h-5 rounded border-2 border-white ${task.completed ? 'bg-white' : 'bg-transparent'}`} />
                      </button>
                      <div className="text-white">
                        {isSorted && sortedTask ? (
                          <>
                            <div className="flex items-center gap-2 text-xs opacity-90">
                              <Calendar className="w-3 h-3" />
                              <span>{sortedTask.dueDate}</span>
                              {sortedTask.dueTime && (
                                <>
                                  <Clock className="w-3 h-3 ml-1" />
                                  <span>{sortedTask.dueTime}</span>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-sm">
                              {task.date ? new Date(task.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'Task'}
                            </p>
                            <p className="text-xs opacity-90">{task.date}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSorted && sortedTask && (
                        <div className="bg-white/20 rounded-full px-3 py-1">
                          <p className="text-xs text-white font-semibold">{sortedTask.difficulty}</p>
                        </div>
                      )}
                      <Star className="w-5 h-5 text-white opacity-60" />
                    </div>
                  </div>
                  
                  {/* Body */}
                  <div className="bg-[#e8d4d9] px-5 py-6">
                    <h3
                      className={`text-lg font-semibold text-[#7d6b73] mb-2 ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    {!isSorted && task.time && (
                      <p className="text-sm text-[#9d8a92]">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {task.time}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
