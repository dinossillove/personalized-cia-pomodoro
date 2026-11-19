# 🌸 PAW Task & Deadline Tracker (CRUD 1 Tabel dengan Express.js & MySQL)

Aplikasi manajemen tugas dan deadline kuliah terintegrasi Pomodoro Timer yang dikembangkan untuk memenuhi Tugas Akhir Mata Kuliah **Pemrograman Aplikasi Web (PAW)**, Program Studi Teknik Informatika / Sistem Informasi, Universitas Brawijaya.

Aplikasi ini mengelola 1 tabel utama (`tasks`) dengan implementasi **CRUD (Create, Read, Update, Delete)** penuh menggunakan **Express.js**, **MySQL (Laragon)**, dan frontend interaktif dengan **AJAX (Fetch API)**.

---

## 🛠️ Tech Stack
- **Backend:** Express.js (Node.js) & `mysql2`
- **Database:** MySQL (Laragon / phpMyAdmin)
- **Frontend:** React.js, Tailwind CSS, Vite
- **Komunikasi Data:** Asynchronous JavaScript & XML / JSON (AJAX via `fetch()`)

---

## 📋 Struktur Tabel Database (`tasks`)

Database: `paw_task_tracker`  
Tabel: `tasks`

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik tiap tugas |
| `title` | `VARCHAR(255) NOT NULL` | Judul / nama tugas kuliah |
| `date` | `DATETIME NOT NULL` | Deadline atau tanggal pelaksanaan |
| `category` | `VARCHAR(100) NOT NULL` | Kategori (PR, Praktikum, Proyek, Responsi) |
| `type` | `ENUM('Individu', 'Kelompok')` | Jenis pengerjaan tugas |
| `status` | `ENUM('Pending', 'Selesai')` | Status penyelesaian tugas |
| `created_at` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu data dibuat |

---

## 🔌 Dokumentasi REST API (CRUD)

| Method | Endpoint | Fungsi | Payload / Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Mengambil seluruh daftar tugas (Read All) | - |
| `GET` | `/api/tasks/:id` | Mengambil 1 tugas spesifik berdasarkan ID | - |
| `POST` | `/api/tasks` | Menambahkan tugas baru (Create) | `{ "title", "date", "category", "type", "status" }` |
| `PUT` | `/api/tasks/:id` | Mengedit / memperbarui tugas (Update) | `{ "title", "date", "category", "type", "status" }` |
| `DELETE` | `/api/tasks/:id` | Menghapus tugas dari database (Delete) | - |

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- **Laragon** (atau XAMPP) sudah terinstal.
- **Node.js** (v18 ke atas) & **Git** sudah terinstal.

### 2. Nyalakan Database di Laragon
1. Buka aplikasi **Laragon**.
2. Klik tombol **Start All** (pastikan service **MySQL** berstatus hijau/aktif di port 3306).
*(Catatan: Server Express akan secara otomatis membuat database `paw_task_tracker` dan tabel `tasks` saat pertama kali dijalankan).*

### 3. Masuk ke Direktori Project
```bash
cd "C:\laragon\www\paw-task-tracker"
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Jalankan Aplikasi
Jalankan backend Express dan frontend Vite sekaligus:
```bash
npm run dev
```
- Frontend berjalan di: `http://localhost:5173`
- Backend API Express berjalan di: `http://localhost:5000`

