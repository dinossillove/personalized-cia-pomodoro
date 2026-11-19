import React, { useState } from 'react';

export default function TaskList({
  tasks,
  activeTaskId,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onToggleStatus,
  loading,
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Individu');
  const [error, setError] = useState('');

  // State untuk Modal Edit
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState('Individu');
  const [editStatus, setEditStatus] = useState('Pending');
  const [editError, setEditError] = useState('');

  // Mengurutkan tugas berdasarkan tanggal terdekat secara otomatis
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  const toInputDatetime = (dateString) => {
    try {
      const d = new Date(dateString);
      const pad = (n) => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const mins = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${mins}`;
    } catch {
      return '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !date || !category.trim()) {
      setError('Judul, tanggal, dan kategori wajib diisi.');
      return;
    }

    onAddTask({
      title: title.trim(),
      date,
      category: category.trim(),
      type,
      status: 'Pending',
    });

    setTitle('');
    setDate('');
    setCategory('');
    setType('Individu');
    setError('');
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDate(toInputDatetime(task.date));
    setEditCategory(task.category);
    setEditType(task.type || 'Individu');
    setEditStatus(task.status || 'Pending');
    setEditError('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDate || !editCategory.trim()) {
      setEditError('Judul, tanggal, dan kategori wajib diisi.');
      return;
    }

    onUpdateTask(editingTask.id, {
      title: editTitle.trim(),
      date: editDate,
      category: editCategory.trim(),
      type: editType,
      status: editStatus,
    });

    setEditingTask(null);
  };

  return (
    <div className="w-full lg:max-h-[calc(100vh-3rem)] lg:sticky lg:top-6 bg-[#f4ffed]/90 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] border-4 border-dashed border-green-300 scrapbook-shadow-green p-4 sm:p-5 flex flex-col min-w-0">
      <div className="text-center mb-4">
        <h2 className="font-caveat text-4xl sm:text-5xl text-green-600 font-bold drop-shadow-sm leading-none">
          My Task List
        </h2>
        <p className="text-sm text-green-500 font-bold uppercase tracking-widest mt-1">
          {sortedTasks.length} tugas tersimpan {loading && '(Memuat...)'}
        </p>
      </div>

      {/* Form Tambah Tugas (CREATE) */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-5 bg-white/90 rounded-3xl border border-green-200 p-4 shadow-sm w-full">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Judul Tugas</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Belajar Express.js CRUD"
            className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Deadline</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Kategori</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="PR / Praktikum / Proyek"
              className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 bg-white"
            >
              <option value="Individu">Individu</option>
              <option value="Kelompok">Kelompok</option>
            </select>
          </div>
        </div>

        {error && <p className="text-[13px] text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-green-500 text-white py-2 font-bold shadow hover:bg-green-600 transition-colors"
        >
          + Tambah Tugas
        </button>
      </form>

      {/* List Daftar Tugas (READ & DELETE & UPDATE Trigger) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0 sm:pr-2 space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-6xl mb-4">✨</p>
            <p className="font-bold">Wah, belum ada tugas!</p>
            <p className="text-sm">Waktunya bersantai ☕ atau tambah tugas baru.</p>
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const isTop = index === 0;
            const isSelected = task.id === activeTaskId;
            const isDone = task.status === 'Selesai';

            return (
              <div
                key={task.id}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  isDone
                    ? 'bg-gray-50/90 border-gray-300 opacity-80'
                    : isSelected
                    ? 'bg-pink-50 border-pink-400 shadow-[4px_4px_0_#f472b6] transform -rotate-1'
                    : isTop
                    ? 'bg-white border-green-400 shadow-[4px_4px_0_#86efac]'
                    : 'bg-white/80 border-gray-200 hover:border-green-300'
                }`}
              >
                {isSelected && !isDone && (
                  <div className="absolute -top-3 right-2 sm:-right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Target aktif
                  </div>
                )}
                {!isSelected && isTop && !isDone && (
                  <div className="absolute -top-3 right-2 sm:-right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    Next! 🎯
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <span
                    className={`w-fit text-xs font-bold px-2 py-1 rounded-lg ${
                      isDone
                        ? 'bg-gray-200 text-gray-600 line-through'
                        : isSelected
                        ? 'bg-pink-100 text-pink-600'
                        : isTop
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    ⏰ {formatDate(task.date)}
                  </span>

                  {/* Tombol Aksi: Pilih, Edit, Hapus */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectTask && onSelectTask(task)}
                      disabled={isSelected || isDone}
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors ${
                        isDone
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-pink-100 text-pink-600 cursor-default'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isSelected ? 'Terpilih' : 'Pilih Target'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(task)}
                      className="text-blue-600 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      title="Edit Tugas"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-500 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                      title="Hapus Tugas"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>

                <h3
                  className={`font-bold text-lg leading-tight mb-2 break-words ${
                    isDone
                      ? 'text-gray-400 line-through'
                      : isSelected
                      ? 'text-pink-600'
                      : isTop
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {task.title}
                </h3>

                {/* Badges: Kategori, Tipe, & Status */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    📂 {task.category}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    👥 {task.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStatus && onToggleStatus(task)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase cursor-pointer transition-all hover:scale-105 ${
                      isDone
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                    title="Klik untuk toggle status"
                  >
                    {isDone ? '✅ Selesai' : '⏳ Pending'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL POPUP EDIT TUGAS (UPDATE) */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#fffaf0] rounded-[2rem] border-4 border-dashed border-pink-400 scrapbook-shadow p-6 w-full max-w-md relative">
            <div className="text-center mb-4">
              <h3 className="font-caveat text-3xl font-bold text-pink-600">✏️ Edit Tugas Kuliah</h3>
              <p className="text-xs text-pink-500 font-semibold">Perbarui informasi tugas di database</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Judul Tugas</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Deadline</label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Kategori</label>
                  <input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-2xl border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Tipe</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full rounded-2xl border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Individu">Individu</option>
                    <option value="Kelompok">Kelompok</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {editError && <p className="text-xs text-red-600 font-bold">{editError}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-2 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-2xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow transition-colors text-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
