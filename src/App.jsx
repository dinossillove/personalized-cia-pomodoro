import React, { useState, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import TaskList from './components/TaskList';
import ActiveActivities from './components/ActiveActivities';

const initialTasks = [];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [nextId, setNextId] = useState(initialTasks.length + 1);
  const [activeTask, setActiveTask] = useState(null); // task selected for Pomodoro
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('pomodoro'); // Pilihan: 'pomodoro' atau 'activities'

  // Load tasks and activeTask from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tasks');
      let parsed = null;
      if (raw) {
        parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          const maxId = parsed.reduce((m, t) => Math.max(m, Number(t.id) || 0), 0);
          setNextId(maxId + 1);
        } else {
          parsed = null;
        }
      }

      const storedActive = localStorage.getItem('activeTaskId');
      if (storedActive) {
        const id = Number(storedActive);
        const all = parsed || initialTasks;
        const t = all.find(x => x.id === id);
        if (t) setActiveTask(t);
      }
    } catch (e) {
      console.warn('Failed to load tasks from localStorage', e);
    }
  }, []);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  }, [tasks]);

  // Persist activeTask selection
  useEffect(() => {
    try {
      if (activeTask) localStorage.setItem('activeTaskId', String(activeTask.id));
      else localStorage.removeItem('activeTaskId');
    } catch (e) {
      console.warn('Failed to save activeTask', e);
    }
  }, [activeTask]);

  // Mendapatkan tugas teratas setelah diurutkan berdasarkan waktu terdekat
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  const topTask = sortedTasks.length > 0 ? sortedTasks[0] : null;
  const activeTaskStillExists = activeTask && tasks.some(task => task.id === activeTask.id);
  const pomodoroTask = activeTaskStillExists ? activeTask : topTask;

  // Fungsi untuk menambahkan tugas baru
  const handleAddTask = (newTask) => {
    const taskToAdd = { id: nextId, ...newTask };
    setTasks((currentTasks) => [...currentTasks, taskToAdd]);
    if (!activeTaskStillExists) {
      setActiveTask(taskToAdd);
    }
    setNextId((currentId) => currentId + 1);
  };

  // Fungsi untuk menghapus tugas yang sudah selesai / dihapus manual
  const handleDeleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter(task => task.id !== taskId));
    if (activeTask && activeTask.id === taskId) setActiveTask(null);
  };

  const handleCompleteTask = (taskId) => {
    handleDeleteTask(taskId);
  };

  const handleSelectTask = (task) => {
    setActiveTask(task);
    setActiveTab('pomodoro');
  };

  return (
    <div className="min-h-screen bg-gingham font-quicksand p-3 sm:p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 text-gray-800 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* BAGIAN KIRI: AREA DINAMIS (70%)                           */}
      {/* ========================================================= */}
      <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4">
        
        {/* Header dan Tombol Navigasi Slide */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-1">
          <div className="min-w-0">
            <h1 className="font-caveat text-4xl sm:text-5xl md:text-6xl text-pink-500 font-bold drop-shadow-sm leading-none break-words">
              Digital Diary 🌸
            </h1>
            <p className="text-pink-600 font-semibold ml-1 text-sm md:text-base">Welcome to your personal space!</p>
          </div>
          
          {/* Tombol Slide Navigasi */}
          <div className="flex flex-wrap gap-2 bg-white/60 p-1.5 rounded-2xl backdrop-blur-sm self-start sm:self-auto border border-pink-100">
            <button 
              onClick={() => setActiveTab('pomodoro')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'pomodoro' ? 'bg-pink-400 text-white shadow-md' : 'text-pink-500 hover:bg-pink-100'
              }`}
            >
              🍅 Pomodoro
            </button>
            <button 
              onClick={() => setActiveTab('activities')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'activities' ? 'bg-pink-400 text-white shadow-md' : 'text-pink-500 hover:bg-pink-100'
              }`}
            >
              🧸 Kegiatanku
            </button>
          </div>
          {/* Tombol tampilkan TaskList (mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="px-3 py-2 rounded-xl font-bold text-sm bg-green-100 text-green-700"
            >
              {showRightPanel ? 'Tutup Tugas' : 'Tugas'}
            </button>
          </div>
        </div>

        {/* Kotak Utama Konten Kiri */}
        <div className="flex-1 min-h-[520px] lg:min-h-[calc(100vh-3rem)] bg-[#fffaf0]/95 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] border-4 border-dashed border-pink-300 scrapbook-shadow p-3 sm:p-6 flex items-stretch sm:items-center justify-center relative overflow-visible">
          {activeTab === 'pomodoro' ? (
            <PomodoroTimer topTask={pomodoroTask} onCompleteTask={handleCompleteTask} />
          ) : (
            <ActiveActivities />
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* BAGIAN KANAN: AREA STATIS TIMELINE (30%)                  */}
      {/* ========================================================= */}
      <div className={`${showRightPanel ? 'block' : 'hidden lg:block'} w-full lg:w-[24rem] xl:w-[28rem] lg:shrink-0`}>
        <TaskList
          tasks={tasks}
          activeTaskId={pomodoroTask?.id}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onSelectTask={handleSelectTask}
        />
      </div>

    </div>
  );
}
