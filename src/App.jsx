import React, { useState, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import TaskList from './components/TaskList';
import ActiveActivities from './components/ActiveActivities';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // task terpilih untuk Pomodoro
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('pomodoro'); // 'pomodoro' atau 'activities'
  const [dbError, setDbError] = useState(null);

  // 1. AJAX READ: Mengambil data tugas dari Express API
  const fetchTasks = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setTasks(result.data);

        // Pertahankan activeTask jika masih ada di data baru
        const storedActiveId = localStorage.getItem('activeTaskId');
        if (storedActiveId) {
          const found = result.data.find((t) => t.id === Number(storedActiveId));
          if (found) setActiveTask(found);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil data dari API:', err);
      setDbError(
        'Belum terhubung ke server Express / MySQL Laragon. Pastikan Laragon MySQL aktif dan server Express berjalan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Simpan activeTaskId ke localStorage agar tetap konsisten saat reload
  useEffect(() => {
    try {
      if (activeTask) {
        localStorage.setItem('activeTaskId', String(activeTask.id));
      } else {
        localStorage.removeItem('activeTaskId');
      }
    } catch (e) {
      console.warn('Gagal menyimpan activeTask ke localStorage', e);
    }
  }, [activeTask]);

  // Urutkan tugas berdasarkan deadline terdekat
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  // Ambil tugas yang belum selesai untuk target default Pomodoro
  const pendingTasks = sortedTasks.filter((t) => t.status !== 'Selesai');
  const topTask = pendingTasks.length > 0 ? pendingTasks[0] : (sortedTasks[0] || null);
  const activeTaskStillExists = activeTask && tasks.some((t) => t.id === activeTask.id);
  const pomodoroTask = activeTaskStillExists ? activeTask : topTask;

  // 2. AJAX CREATE: Menambahkan tugas baru ke Express API
  const handleAddTask = async (newTaskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });

      const result = await response.json();
      if (result.success && result.data) {
        // Update state lokal atau refresh
        setTasks((prev) => [...prev, result.data]);
        if (!activeTask) {
          setActiveTask(result.data);
        }
      } else {
        alert(result.message || 'Gagal menambahkan tugas.');
      }
    } catch (err) {
      console.error('Error saat tambah tugas:', err);
      alert('Gagal menghubungi server Express. Pastikan server aktif.');
    }
  };

  // 3. AJAX UPDATE: Mengedit informasi tugas
  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, ...result.data } : task))
        );
        if (activeTask && activeTask.id === taskId) {
          setActiveTask((prev) => ({ ...prev, ...result.data }));
        }
      } else {
        alert(result.message || 'Gagal mengubah data tugas.');
      }
    } catch (err) {
      console.error('Error saat update tugas:', err);
      alert('Gagal menghubungi server Express.');
    }
  };

  // Toggle Status Cepat (Pending <-> Selesai)
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Selesai' ? 'Pending' : 'Selesai';
    await handleUpdateTask(task.id, {
      ...task,
      status: newStatus,
    });
  };

  // 4. AJAX DELETE: Menghapus tugas dari database
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Yakin ingin menghapus tugas ini dari database?')) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        if (activeTask && activeTask.id === taskId) {
          setActiveTask(null);
        }
      } else {
        alert(result.message || 'Gagal menghapus tugas.');
      }
    } catch (err) {
      console.error('Error saat hapus tugas:', err);
      alert('Gagal menghubungi server Express.');
    }
  };

  // Ketika Pomodoro selesai, ubah status tugas jadi Selesai
  const handleCompleteTask = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      await handleUpdateTask(taskId, { ...target, status: 'Selesai' });
    }
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
        {/* Banner Peringatan jika belum terhubung */}
        {dbError && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-3 rounded-xl text-xs sm:text-sm flex justify-between items-center">
            <span>⚠️ {dbError}</span>
            <button
              onClick={fetchTasks}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Header dan Tombol Navigasi Slide */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-1">
          <div className="min-w-0">
            <h1 className="font-caveat text-4xl sm:text-5xl md:text-6xl text-pink-500 font-bold drop-shadow-sm leading-none break-words">
              Digital Diary 🌸
            </h1>
            <p className="text-pink-600 font-semibold ml-1 text-sm md:text-base">
              PAW Task & Deadline Tracker (Express.js + MySQL CRUD)
            </p>
          </div>

          {/* Tombol Slide Navigasi */}
          <div className="flex flex-wrap gap-2 bg-white/60 p-1.5 rounded-2xl backdrop-blur-sm self-start sm:self-auto border border-pink-100">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'pomodoro'
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'text-pink-500 hover:bg-pink-100'
              }`}
            >
              🍅 Pomodoro
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'activities'
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'text-pink-500 hover:bg-pink-100'
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
              {showRightPanel ? 'Tutup Tugas' : 'Daftar Tugas'}
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
      <div className={`${showRightPanel ? 'block' : 'hidden lg:block'} w-full lg:w-[26rem] xl:w-[29rem] lg:shrink-0`}>
        <TaskList
          tasks={tasks}
          activeTaskId={pomodoroTask?.id}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onSelectTask={handleSelectTask}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />
      </div>
    </div>
  );
}
