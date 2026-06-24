import React, { useState } from 'react';

export default function TaskList({ tasks, activeTaskId, onAddTask, onDeleteTask, onSelectTask }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Individu');
  const [error, setError] = useState('');

  // Mengurutkan tugas berdasarkan tanggal terdekat secara otomatis
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !date || !category.trim()) {
      setError('Judul, tanggal, dan kategori wajib diisi.');
      return;
    }

    onAddTask({ title: title.trim(), date, category: category.trim(), type });
    setTitle('');
    setDate('');
    setCategory('');
    setType('Individu');
    setError('');
  };

  return (
    <div className="w-full lg:max-h-[calc(100vh-3rem)] lg:sticky lg:top-6 bg-[#f4ffed]/90 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] border-4 border-dashed border-green-300 scrapbook-shadow-green p-4 sm:p-5 flex flex-col min-w-0">
      <div className="text-center mb-6">
        <h2 className="font-caveat text-4xl sm:text-5xl text-green-600 font-bold drop-shadow-sm leading-none">
          My Task List
        </h2>
        <p className="text-sm text-green-500 font-bold uppercase tracking-widest mt-1">
          {sortedTasks.length} tugas tersimpan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-5 bg-white/90 rounded-3xl border border-green-200 p-4 shadow-sm w-full">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Judul Tugas</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Belajar React"
            className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Tanggal & Waktu</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Kategori</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="PR / Meeting / Lomba"
              className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-green-600">Tipe</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
            >
              <option value="Individu">Individu</option>
              <option value="Kelompok">Kelompok</option>
            </select>
          </div>
        </div>

        {error && <p className="text-[13px] text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full sm:w-auto rounded-2xl bg-green-500 text-white py-2 font-bold shadow hover:bg-green-600 transition-colors"
        >
          Tambah Tugas
        </button>
      </form>

      <div className="flex-1 min-h-0 overflow-y-auto pr-0 sm:pr-2 space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-6xl mb-4">✨</p>
            <p className="font-bold">Wah, nggak ada tugas!</p>
            <p className="text-sm">Waktunya bersantai ☕</p>
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const isTop = index === 0;
            const isSelected = task.id === activeTaskId;
            return (
              <div
                key={task.id}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-pink-50 border-pink-400 shadow-[4px_4px_0_#f472b6] transform -rotate-1'
                    : isTop
                    ? 'bg-white border-green-400 shadow-[4px_4px_0_#86efac]'
                    : 'bg-white/80 border-gray-200 hover:border-green-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 right-2 sm:-right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Target aktif
                  </div>
                )}
                {!isSelected && isTop && (
                  <div className="absolute -top-3 right-2 sm:-right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    Next! 🎯
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <span className={`w-fit text-xs font-bold px-2 py-1 rounded-lg ${isSelected ? 'bg-pink-100 text-pink-600' : isTop ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {formatDate(task.date)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTask && onSelectTask(task)}
                      disabled={isSelected}
                      className={`text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-pink-100 text-pink-600 cursor-default'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isSelected ? 'Terpilih' : 'Pilih Target'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-500 text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                <h3 className={`font-bold text-lg leading-tight mb-2 break-words ${isSelected ? 'text-pink-600' : isTop ? 'text-green-700' : 'text-gray-700'}`}>
                  {task.title}
                </h3>

                <div className="flex flex-wrap gap-1">
                  <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {task.category}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {task.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
