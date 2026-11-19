import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'paw_task_tracker';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// Inisialisasi Database dan Tabel Otomatis
export async function initDatabase() {
  try {
    // 1. Koneksi awal ke MySQL tanpa database untuk membuat DB jika belum ada
    const initialConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await initialConnection.end();

    // 2. Buat tabel tasks jika belum ada
    const dbPool = getPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        category VARCHAR(100) NOT NULL,
        type ENUM('Individu', 'Kelompok') DEFAULT 'Individu',
        status ENUM('Pending', 'Selesai') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await dbPool.query(createTableQuery);

    // 3. Tambahkan contoh data jika tabel masih kosong
    const [rows] = await dbPool.query('SELECT COUNT(*) AS total FROM tasks');
    if (rows[0].total === 0) {
      await dbPool.query(`
        INSERT INTO tasks (title, date, category, type, status) VALUES
        ('Praktikum PAW Modul Express & REST API', '2026-11-20 23:59:00', 'Kuliah', 'Individu', 'Pending'),
        ('Tugas Kelompok Proyek Akhir Web', '2026-11-25 15:00:00', 'Proyek', 'Kelompok', 'Pending'),
        ('Persiapan Kuis Pemrograman Web', '2026-11-22 09:00:00', 'Ujian', 'Individu', 'Selesai');
      `);
      console.log('Sample data awal berhasil dimasukkan ke tabel tasks.');
    }

    console.log(`[Database] Terhubung ke MySQL Laragon (${DB_NAME}) di port ${DB_PORT}`);
  } catch (err) {
    console.error('[Database Error] Gagal terhubung ke MySQL Laragon:', err.message);
    console.warn('[Tips] Pastikan Laragon sudah dibuka dan klik "Start All" (MySQL aktif di port 3306).');
  }
}

export default { initDatabase, getPool };
