-- ============================================================
-- DATABASE & TABLE SETUP FOR TUGAS AKHIR PAW (CRUD EXPRESS.JS)
-- ============================================================

CREATE DATABASE IF NOT EXISTS paw_task_tracker;
USE paw_task_tracker;

-- 1 Tabel Utama: tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    category VARCHAR(100) NOT NULL,
    type ENUM('Individu', 'Kelompok') DEFAULT 'Individu',
    status ENUM('Pending', 'Selesai') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Sample Awal
INSERT INTO tasks (title, date, category, type, status) VALUES
('Praktikum PAW Modul Express & REST API', '2026-11-20 23:59:00', 'Kuliah', 'Individu', 'Pending'),
('Tugas Kelompok Proyek Akhir Web', '2026-11-25 15:00:00', 'Proyek', 'Kelompok', 'Pending'),
('Persiapan Kuis Pemrograman Web', '2026-11-22 09:00:00', 'Ujian', 'Individu', 'Selesai');
