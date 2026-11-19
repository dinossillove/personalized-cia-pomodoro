import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, getPool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from production build (dist) if exists
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================
// REST API ENDPOINTS: CRUD FOR 1 TABEL (tasks)
// ==========================================

// 1. READ ALL - Ambil semua daftar tugas
app.get('/api/tasks', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY date ASC');
    res.json({
      success: true,
      message: 'Berhasil mengambil data tugas',
      data: rows,
    });
  } catch (error) {
    console.error('Error GET /api/tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tugas dari database',
      error: error.message,
    });
  }
});

// 2. READ BY ID - Ambil satu tugas berdasarkan ID
app.get('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan ID ${id} tidak ditemukan`,
      });
    }
    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(`Error GET /api/tasks/${id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data tugas',
      error: error.message,
    });
  }
});

// 3. CREATE - Tambah tugas baru
app.post('/api/tasks', async (req, res) => {
  const { title, date, category, type, status } = req.body;

  // Validasi input sederhana
  if (!title || !date || !category) {
    return res.status(400).json({
      success: false,
      message: 'Field title, date, dan category wajib diisi.',
    });
  }

  try {
    const pool = getPool();
    const taskType = type || 'Individu';
    const taskStatus = status || 'Pending';

    // Format datetime string untuk MySQL (YYYY-MM-DD HH:mm:ss)
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.query(
      'INSERT INTO tasks (title, date, category, type, status) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), formattedDate, category.trim(), taskType, taskStatus]
    );

    const newTask = {
      id: result.insertId,
      title: title.trim(),
      date: formattedDate,
      category: category.trim(),
      type: taskType,
      status: taskStatus,
    };

    res.status(201).json({
      success: true,
      message: 'Tugas baru berhasil ditambahkan',
      data: newTask,
    });
  } catch (error) {
    console.error('Error POST /api/tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan tugas ke database',
      error: error.message,
    });
  }
});

// 4. UPDATE - Edit tugas berdasarkan ID
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, date, category, type, status } = req.body;

  if (!title || !date || !category) {
    return res.status(400).json({
      success: false,
      message: 'Field title, date, dan category wajib diisi.',
    });
  }

  try {
    const pool = getPool();

    // Format datetime string untuk MySQL
    const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    const taskType = type || 'Individu';
    const taskStatus = status || 'Pending';

    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, date = ?, category = ?, type = ?, status = ? WHERE id = ?',
      [title.trim(), formattedDate, category.trim(), taskType, taskStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan ID ${id} tidak ditemukan`,
      });
    }

    res.json({
      success: true,
      message: 'Tugas berhasil diperbarui',
      data: {
        id: Number(id),
        title: title.trim(),
        date: formattedDate,
        category: category.trim(),
        type: taskType,
        status: taskStatus,
      },
    });
  } catch (error) {
    console.error(`Error PUT /api/tasks/${id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data tugas',
      error: error.message,
    });
  }
});

// 5. DELETE - Hapus tugas berdasarkan ID
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan ID ${id} tidak ditemukan`,
      });
    }

    res.json({
      success: true,
      message: `Tugas dengan ID ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.error(`Error DELETE /api/tasks/${id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus tugas dari database',
      error: error.message,
    });
  }
});

// Fallback untuk SPA React (jika dist sudah di-build)
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('API Server Express.js berjalan. Buka frontend via Vite di http://localhost:5173');
    }
  });
});

// Jalankan Server & Init Database
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Express.js CRUD Server berjalan di http://localhost:${PORT}`);
    console.log(`📁 Endpoint API: http://localhost:${PORT}/api/tasks`);
    console.log(`====================================================`);
  });
}

startServer();
