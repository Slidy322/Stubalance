import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Task, SortedTask } from '../lib/types';
import { taskStore } from '../lib/taskStore';
import { Calendar, Clock, Target, ChevronDown, ChevronUp, CheckCircle2, Star, Folder, Sparkles, Trash2, User, CalendarDays } from 'lucide-react';

const getDefaultTasks = (): Task[] => {
  const today = new Date();
  return [
    {
      id: '1',
      title: 'Finish homework',
      time: '4:00 PM',
      date: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      completed: false,
    },
    {
      id: '2',
      title: 'Review biology notes',
      time: '6:30 PM',
      date: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      completed: false,
    },
    {
      id: '3',
      title: 'Workout',
      time: '8:00 PM',
      date: today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      completed: false,
    },
  ];
};

const getDefaultWeekTasks = (): Task[] => {
  const today = new Date();
  return [
    {
      id: '4',
      title: 'Math quiz review',
      time: '5:00 PM',
      date: new Date(today.getTime() + 86400000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      completed: false,
    },
    {
      id: '5',
      title: 'Science project meeting',
      time: '3:30 PM',
      date: new Date(today.getTime() + 172800000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      completed: false,
    },
    {
      id: '6',
      title: 'Submit English essay',
      time: '11:59 PM',
      date: new Date(today.getTime() + 259200000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      completed: false,
    },
  ];
};

export function Dashboard() {
  const navigate = useNavigate();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const [sortedTasks, setSortedTasks] = useState<SortedTask[]>([]);
  const [weekExpanded, setWeekExpanded] = useState(false);

  useEffect(() => {
    // Load tasks from storage
    const today = taskStore.getTodayTasks();
    const week = taskStore.getWeekTasks();
    const sorted = taskStore.getSortedTasks();

    setTodayTasks(today);
    setWeekTasks(week);
    setSortedTasks(sorted);
  }, []);

  const toggleTaskComplete = (taskId: string, isToday: boolean) => {
    if (isToday) {
      const updated = todayTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      setTodayTasks(updated);
      taskStore.saveTodayTasks(updated);
    } else {
      const updated = weekTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      setWeekTasks(updated);
      taskStore.saveWeekTasks(updated);
    }
  };

  const toggleSortedTaskComplete = (taskId: string) => {
    const updated = sortedTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setSortedTasks(updated);
    taskStore.saveSortedTasks(updated);
  };

  const clearAllTasks = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
      setTodayTasks([]);
      setWeekTasks([]);
      setSortedTasks([]);
      taskStore.saveTodayTasks([]);
      taskStore.saveWeekTasks([]);
      taskStore.saveSortedTasks([]);
    }
  };

  const getUrgencyInfo = (score: number) => {
    if (score >= 100) return { text: 'OVERDUE', color: 'bg-red-500', emoji: '🔴' };
    if (score >= 80) return { text: 'Very Urgent', color: 'bg-orange-500', emoji: '🟠' };
    if (score >= 60) return { text: 'Urgent', color: 'bg-yellow-500', emoji: '🟡' };
    return { text: 'Normal', color: 'bg-green-500', emoji: '🟢' };
  };

  // Calculate workload level
  const totalTasks = todayTasks.length + sortedTasks.filter(t => !t.completed).length;
  const completedTasks = todayTasks.filter(t => t.completed).length + sortedTasks.filter(t => t.completed).length;
  const inProgressTasks = sortedTasks.filter(t => !t.completed).length;
  const fatigueLevel = totalTasks > 0 ? Math.round(((totalTasks - completedTasks) / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fff5f5]">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-[#e8d4e0] via-[#f0e0eb] to-[#e8d4e0] rounded-3xl shadow-sm p-8 md:p-10 mb-6 relative overflow-hidden border-4 border-[#d4b5c9]">
          {/* Decorative pattern background */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b4a0a8' fill-opacity='0.4'%3E%3Cpath d='M30 25c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-2c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z'/%3E%3Cpath d='M15 10l2 2-2 2-2-2 2-2zm30 0l2 2-2 2-2-2 2-2zm-15 35l2 2-2 2-2-2 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#b4a0a8] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '2px' }}>
                  STU-BALANCE
                </h1>
                <p className="text-[#c4b0b8] text-lg" style={{ fontFamily: 'Georgia, serif' }}>Smart Workload Manager</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#d4b5c9] bg-white/50"></div>
            </div>

            {/* Fatigue Level Bar */}
            <div className="mt-6 bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#b4a0a8]" />
                  <span className="text-[#7d6b73] font-semibold">Workload Level</span>
                </div>
                <span className="text-[#b4a0a8] font-bold">{fatigueLevel}%</span>
              </div>
              <div className="w-full bg-[#e8d4d9] rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#b4a0a8] to-[#9d8a92] h-full rounded-full transition-all duration-500"
                  style={{ width: `${fatigueLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/focus')}
            className="bg-gradient-to-br from-[#d4b5c9] to-[#c4a5b9] hover:from-[#c4a5b9] hover:to-[#b495a9] rounded-3xl p-6 shadow-sm transition-all duration-200 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='35' cy='35' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Focus
                </h3>
                <p className="text-white/80 text-sm">Start Session</p>
              </div>
              <Folder className="w-16 h-16 text-white/60" strokeWidth={1.5} />
            </div>
          </button>

          <button
            onClick={() => navigate('/task-sorter')}
            className="bg-gradient-to-br from-[#d4b5c9] to-[#c4a5b9] hover:from-[#c4a5b9] hover:to-[#b495a9] rounded-3xl p-6 shadow-sm transition-all duration-200 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='35' cy='35' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Schedule
                </h3>
                <p className="text-white/80 text-sm">Auto-planned schedule</p>
              </div>
              <Folder className="w-16 h-16 text-white/60" strokeWidth={1.5} />
            </div>
          </button>

          <button
            onClick={() => navigate('/my-task')}
            className="bg-gradient-to-br from-[#d4b5c9] to-[#c4a5b9] hover:from-[#c4a5b9] hover:to-[#b495a9] rounded-3xl p-6 shadow-sm transition-all duration-200 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='35' cy='35' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  My Task
                </h3>
                <p className="text-white/80 text-sm">Calendar View</p>
              </div>
              <CalendarDays className="w-16 h-16 text-white/60" strokeWidth={1.5} />
            </div>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-br from-[#d4b5c9] to-[#c4a5b9] hover:from-[#c4a5b9] hover:to-[#b495a9] rounded-3xl p-6 shadow-sm transition-all duration-200 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='35' cy='35' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Profile
                </h3>
                <p className="text-white/80 text-sm">Your Information</p>
              </div>
              <User className="w-16 h-16 text-white/60" strokeWidth={1.5} />
            </div>
          </button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[#b4a0a8] font-semibold mb-1" style={{ fontFamily: 'Georgia, serif' }}>In Progress</p>
            <p className="text-2xl font-bold text-[#7d6b73]">{inProgressTasks}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[#b4a0a8] font-semibold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Completed</p>
            <p className="text-2xl font-bold text-[#7d6b73]">{completedTasks}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-[#b4a0a8] font-semibold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Total</p>
            <p className="text-2xl font-bold text-[#7d6b73]">{totalTasks}</p>
          </div>
        </div>

        {/* Tasks Today */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#b4a0a8]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Today's Tasks
            </h2>
            {(todayTasks.length > 0 || weekTasks.length > 0 || sortedTasks.length > 0) && (
              <button
                onClick={clearAllTasks}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Clear All</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Header with day and date */}
                <div className="bg-[#b4a0a8] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id, true)}
                      className="flex-shrink-0"
                    >
                      <div className={`w-5 h-5 rounded border-2 border-white ${task.completed ? 'bg-white' : 'bg-transparent'}`} />
                    </button>
                    <div className="text-white">
                      <p className="font-bold text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <p className="text-xs opacity-90">{task.date}</p>
                    </div>
                  </div>
                  <Star className="w-5 h-5 text-white opacity-60" />
                </div>
                {/* Body with task details */}
                <div className="bg-[#e8d4d9] px-5 py-6">
                  <h3
                    className={`text-lg font-semibold text-[#7d6b73] mb-2 ${
                      task.completed ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-[#9d8a92]">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {task.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks This Week */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <button
            onClick={() => setWeekExpanded(!weekExpanded)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#b4a0a8]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                This Week
              </h2>
              {weekExpanded ? (
                <ChevronUp className="w-6 h-6 text-[#b4a0a8]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#b4a0a8]" />
              )}
            </div>
          </button>

          {weekExpanded && (
            <div className="mt-6 space-y-4">
              {weekTasks.map((task) => {
                const taskDate = new Date(task.date);
                const dayName = taskDate.toLocaleDateString('en-US', { weekday: 'long' });
                const dayNum = taskDate.getDate();
                
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div className="bg-[#b4a0a8] px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id, false)}
                          className="flex-shrink-0"
                        >
                          <div className={`w-5 h-5 rounded border-2 border-white ${task.completed ? 'bg-white' : 'bg-transparent'}`} />
                        </button>
                        <div className="text-white">
                          <p className="font-bold text-sm">{dayName}</p>
                          <p className="text-xs opacity-90">{task.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 rounded-full px-3 py-1">
                          <p className="text-xs text-white font-semibold">
                            {dayName.slice(0, 3)} {dayNum}
                          </p>
                        </div>
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
                      <p className="text-sm text-[#9d8a92]">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {task.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Automatically Sorted Tasks */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#b4a0a8] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Priority Tasks
          </h2>
          <p className="text-sm text-[#a89099] mb-6">Ranked by urgency and difficulty</p>

          {sortedTasks.length === 0 ? (
            <p className="text-center text-[#a89099] py-8">
              No sorted tasks yet. Add tasks in the Task Sorter page.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task, index) => {
                const urgency = getUrgencyInfo(task.score);
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div className="bg-[#b4a0a8] px-5 py-3 flex items-center justify-between">
                      <div className="text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm">Priority #{index + 1}</p>
                          <span className={`${urgency.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                            {urgency.emoji} {urgency.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-90">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                          {task.dueTime && (
                            <>
                              <Clock className="w-3 h-3 ml-1" />
                              <span>{task.dueTime}</span>
                            </>
                          )}
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
                    <div className="bg-[#e8d4d9] px-5 py-6">
                      <h3
                        className={`text-lg font-semibold text-[#7d6b73] mb-2 ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}