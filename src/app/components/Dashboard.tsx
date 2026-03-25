import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Task, SortedTask } from '../lib/types';
import { taskStore } from '../lib/taskStore';
import { Calendar, Clock, Target, ChevronDown, ChevronUp, CheckCircle2, Star, Folder, Sparkles, Trash2, User, CalendarDays, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthEnabled, signOut } = useAuth();

  useEffect(() => {
    // Load tasks from storage
    const today = taskStore.getTodayTasks();
    const week = taskStore.getWeekTasks();
    const sorted = taskStore.getSortedTasks();

    setTodayTasks(today);
    setWeekTasks(week);
    setSortedTasks(sorted);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut();
      navigate('/login');
    }
  };

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
        {/* Decorative Header with Profile Button */}
        <div className="bg-gradient-to-br from-[#e8d4e0] via-[#f0e0eb] to-[#e8d4e0] rounded-3xl shadow-sm p-6 md:p-8 text-center mb-8 border-4 border-[#d4b5c9] relative overflow-hidden">
          {/* Decorative corner flourishes */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#d4b5c9] rounded-tl-2xl opacity-50"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#d4b5c9] rounded-tr-2xl opacity-50"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#d4b5c9] rounded-bl-2xl opacity-50"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#d4b5c9] rounded-br-2xl opacity-50"></div>

          {/* Profile Button - Top Right */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-transparent hover:bg-white/20 border-3 border-[#b4a0a8] transition-all duration-200 flex items-center justify-center"
            style={{ borderWidth: '3px' }}
          >
          </button>

          <h1 className="text-4xl md:text-6xl font-bold text-[#b4a0a8] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '2px' }}>
            STU-BALANCE
          </h1>
          <p className="text-[#c4b0b8] text-lg md:text-xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>Smart Workload Manager</p>
          
          {/* Sync Status Indicator */}
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm text-[#9d8a92]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Synced to cloud</span>
            </div>
          )}
          {!user && isAuthEnabled && (
            <div className="flex items-center justify-center gap-2 text-sm text-[#9d8a92]">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Guest mode - data stored locally</span>
            </div>
          )}
        </div>

        {/* Fatigue Level */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#b4a0a8]" />
            <h2 className="text-xl font-bold text-[#b4a0a8]" style={{ fontFamily: 'Georgia, serif' }}>
              Fatigue Level
            </h2>
            <span className="ml-auto text-lg font-bold text-[#7d6b73]">{fatigueLevel}%</span>
          </div>
          <div className="relative w-full h-6 bg-[#f0e0eb] rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#b4a0a8] to-[#9d8a92] transition-all duration-500 rounded-full"
              style={{ width: `${fatigueLevel}%` }}
            />
          </div>
          <p className="text-sm text-[#a89099] mt-3 text-center">
            {fatigueLevel === 0 ? "No tasks yet! You're well-rested 😊" : 
             fatigueLevel <= 25 ? "Light workload - you're doing great! 💪" :
             fatigueLevel <= 50 ? "Moderate workload - stay focused! 📚" :
             fatigueLevel <= 75 ? "High workload - take breaks! ☕" :
             "Very high workload - don't forget self-care! 🌟"}
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
            className="bg-gradient-to-br from-[#d4b5c9] to-[#c4a5b9] hover:from-[#c4a5b9] hover:to-[#b495a9] rounded-3xl p-6 shadow-sm transition-all duration-200 text-left relative overflow-hidden col-span-2"
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

      {/* Profile Menu */}
      {showProfileMenu && (
        <div className="absolute top-16 right-4 md:top-18 md:right-6 w-48 bg-white rounded-3xl shadow-lg z-50" ref={profileMenuRef}>
          <div className="p-4">
            <p className="text-sm text-[#9d8a92]">Signed in as:</p>
            <p className="text-sm font-bold text-[#b4a0a8]">{user?.email}</p>
          </div>
          <div className="border-t border-[#f0e0eb]"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-[#b4a0a8] hover:bg-[#f0e0eb] transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}