import React, { useState, useEffect } from 'react';

export default function ActiveActivities() {
  const initial = [
    { id: 1, name: 'Panitia Makrab Kampus 2026', role: 'Divisi Acara', emoji: '🏕️' },
    { id: 2, name: 'Lomba Business Plan Nasional', role: 'Ketua Tim', emoji: '🏆' },
    { id: 3, name: 'Pengurus BEM Fakultas', role: 'Staff Medinfo', emoji: '🎨' },
  ];

  const [activities, setActivities] = useState(initial);
  const [nextId, setNextId] = useState(initial.length + 1);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', emoji: '🎉' });

  // Load activities from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('activities');
      if (raw) {
        const parsed = JSON.parse(raw);
        setActivities(parsed);
        const maxId = parsed.reduce((m, a) => Math.max(m, a.id), 0);
        setNextId(maxId + 1);
      }
    } catch (e) {
      console.warn('Failed to load activities', e);
    }
  }, []);

  // Persist activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('activities', JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to save activities', e);
    }
  }, [activities]);

  const startEdit = (act) => {
    setEditingId(act.id);
    setForm({ name: act.name, role: act.role, emoji: act.emoji });
  };

  const handleDelete = (id) => {
    setActivities(activities.filter(a => a.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: '', role: '', emoji: '🎉' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;

    if (editingId) {
      setActivities(activities.map(a => a.id === editingId ? { ...a, ...form } : a));
      setEditingId(null);
    } else {
      setActivities([...activities, { id: nextId, ...form }]);
      setNextId(nextId + 1);
    }

    setForm({ name: '', role: '', emoji: '🎉' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', role: '', emoji: '🎉' });
  };

  return (
    <div className="w-full h-full text-center relative z-10 flex flex-col items-center min-w-0">
      <div className="washi-tape washi-tape-green"></div>
      <h2 className="font-caveat text-4xl sm:text-5xl text-green-600 mb-4 font-bold drop-shadow-sm leading-none">
        Kegiatan Aku Saat Ini 📌
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/90 p-4 rounded-3xl border border-green-200 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-green-600">Nama Kegiatan</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Panitia Makrab" className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-green-600">Role</label>
            <input name="role" value={form.role} onChange={handleChange} placeholder="Divisi Acara" className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-green-600">Emoji</label>
            <input name="emoji" value={form.emoji} onChange={handleChange} className="w-full min-w-0 rounded-2xl border border-green-200 px-3 py-2" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-3">
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-2xl border border-gray-200 w-full sm:w-auto">Batal</button>
          )}
          <button type="submit" className="px-4 py-2 rounded-2xl bg-green-500 text-white w-full sm:w-auto">{editingId ? 'Simpan' : 'Tambah'}</button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
        {activities.map((act) => (
          <div key={act.id} className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-green-200 scrapbook-shadow-green transform hover:rotate-1 transition-all text-left relative min-w-0">
            <div className="text-3xl sm:text-4xl absolute top-4 right-4">{act.emoji}</div>
            <h3 className="font-bold text-lg text-gray-800 pr-10 leading-tight break-words">{act.name}</h3>
            <p className="text-green-600 text-sm font-semibold mt-3 bg-green-50 inline-block px-3 py-1 rounded-lg break-words">Role: {act.role}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => startEdit(act)} className="px-3 py-1 text-sm rounded-full bg-yellow-50 border border-yellow-200">Edit</button>
              <button onClick={() => handleDelete(act.id)} className="px-3 py-1 text-sm rounded-full bg-red-50 border border-red-200 text-red-600">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
