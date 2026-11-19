import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_NAME = process.env.DB_NAME || 'paw_task_tracker';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

let pool = null;
let activePassword = process.env.DB_PASSWORD || 'Haiba28_';

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: activePassword,
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
  const passwordsToTry = [activePassword, 'Haiba28_', ''];
  let connected = false;

  for (const pwd of passwordsToTry) {
    try {
      const testConn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: pwd,
        port: DB_PORT,
      });

      activePassword = pwd;
      connected = true;

      // Buat database jika belum ada
      await testConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
      await testConn.end();
      break;
    } catch (e) {
      // Coba password berikutnya jika Access Denied
      if (e.code === 'ER_ACCESS_DENIED_ERROR') {
        continue;
      }
      // Jika ECONNREFUSED, MySQL memang belum berjalan
      throw e;
    }
  }

  if (!connected) {
    throw new Error('Tidak bisa login ke MySQL: Password root tidak cocok.');
  }

  // Buat pool dengan password yang valid
  if (pool) {
    await pool.end();
    pool = null;
  }
  const dbPool = getPool();

  // Buat tabel tasks jika belum ada
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

  // Masukkan data awal jika kosong
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

  console.log(`[Database] Terhubung ke MySQL (${DB_NAME}) di ${DB_HOST}:${DB_PORT}`);
}

export default { initDatabase, getPool };
