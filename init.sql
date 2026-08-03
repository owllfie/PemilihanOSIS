-- ============================================================
-- Database Schema for Sistem Informasi Pemilihan Ketua OSIS
-- Database Engine: PostgreSQL
-- ============================================================

-- Cleanup Existing Objects (Reverse Dependency Order)
DROP TABLE IF EXISTS pengumuman CASCADE;
DROP TABLE IF EXISTS hasil_voting CASCADE;
DROP TABLE IF EXISTS calon_anggota_osis CASCADE;
DROP TABLE IF EXISTS voting CASCADE;
DROP TABLE IF EXISTS calon_ketua CASCADE;
DROP TABLE IF EXISTS siswa CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS periode_pemilihan CASCADE;

DROP TYPE IF EXISTS role_type CASCADE;
DROP TYPE IF EXISTS status_aktif_type CASCADE;
DROP TYPE IF EXISTS status_seleksi_type CASCADE;
DROP TYPE IF EXISTS status_periode_type CASCADE;

-- ------------------------------------------------------------
-- Custom ENUM Types
-- ------------------------------------------------------------
CREATE TYPE role_type AS ENUM (
    'superadmin',
    'admin',
    'siswa',
    'calon_ketua',
    'calon_anggota',
    'pembina',
    'kepala_sekolah'
);

CREATE TYPE status_aktif_type AS ENUM (
    'aktif',
    'nonaktif'
);

CREATE TYPE status_seleksi_type AS ENUM (
    'Menunggu',
    'Lulus',
    'Tidak Lulus'
);

CREATE TYPE status_periode_type AS ENUM (
    'aktif',
    'selesai'
);

-- ------------------------------------------------------------
-- 1. Table: users (Akun Pengguna)
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_type NOT NULL,
    status status_aktif_type NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. Table: siswa (Data Siswa Pemilih / Calon)
-- ------------------------------------------------------------
CREATE TABLE siswa (
    siswa_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    nis VARCHAR(20) UNIQUE NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    rombel VARCHAR(20) NOT NULL,
    jurusan VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. Table: calon_ketua (Pasangan Calon Ketua & Wakil OSIS)
-- ------------------------------------------------------------
CREATE TABLE calon_ketua (
    calon_id SERIAL PRIMARY KEY,
    ketua_id INT NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    wakil_id INT NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    nomor_urut INT NOT NULL UNIQUE,
    visi TEXT,
    misi TEXT,
    foto VARCHAR(255),
    status status_aktif_type NOT NULL DEFAULT 'aktif',
    CONSTRAINT chk_ketua_wakil_different CHECK (ketua_id <> wakil_id)
);

-- ------------------------------------------------------------
-- 4. Table: voting (Pemungutan Suara)
-- ------------------------------------------------------------
CREATE TABLE voting (
    voting_id SERIAL PRIMARY KEY,
    siswa_id INT UNIQUE NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    calon_id INT NOT NULL REFERENCES calon_ketua(calon_id) ON DELETE CASCADE,
    waktu_vote TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 5. Table: calon_anggota_osis (Pendaftaran Anggota OSIS)
-- ------------------------------------------------------------
CREATE TABLE calon_anggota_osis (
    pendaftaran_id SERIAL PRIMARY KEY,
    siswa_id INT NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    alasan TEXT,
    status status_seleksi_type NOT NULL DEFAULT 'Menunggu',
    tanggal_daftar DATE DEFAULT CURRENT_DATE
);

-- ------------------------------------------------------------
-- 6. Table: hasil_voting (Rekapitulasi Suara - Opsional)
-- ------------------------------------------------------------
CREATE TABLE hasil_voting (
    hasil_id SERIAL PRIMARY KEY,
    calon_id INT UNIQUE NOT NULL REFERENCES calon_ketua(calon_id) ON DELETE CASCADE,
    total_suara INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 7. Table: periode_pemilihan (Jadwal Pemilihan)
-- ------------------------------------------------------------
CREATE TABLE periode_pemilihan (
    periode_id SERIAL PRIMARY KEY,
    nama_periode VARCHAR(100) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    status status_periode_type NOT NULL DEFAULT 'aktif'
);

-- ------------------------------------------------------------
-- 8. Table: pengumuman (Pengumuman Sistem)
-- ------------------------------------------------------------
CREATE TABLE pengumuman (
    pengumuman_id SERIAL PRIMARY KEY,
    judul VARCHAR(100) NOT NULL,
    isi TEXT NOT NULL,
    dibuat_oleh INT REFERENCES users(user_id) ON DELETE SET NULL,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Trigger Function for Updated At
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_siswa_timestamp
BEFORE UPDATE ON siswa
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ------------------------------------------------------------
-- Initial Data / Seed Sample Data
-- ------------------------------------------------------------
INSERT INTO users (nama, username, password, role, status) VALUES
('Super Admin', 'superadmin', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'superadmin', 'aktif'),
('Admin OSIS', 'admin', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'admin', 'aktif'),
('Pembina OSIS', 'pembina', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'pembina', 'aktif'),
('Kepala Sekolah', 'kepsek', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'kepala_sekolah', 'aktif'),
('Budi Santoso', 'budi_ketua', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'calon_ketua', 'aktif'),
('Siti Rahma', 'siti_wakil', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'siswa', 'aktif'),
('Andi Pratama', 'andi_ketua', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'calon_ketua', 'aktif'),
('Dewi Lestari', 'dewi_wakil', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'siswa', 'aktif'),
('Eko Wijaya', 'eko_siswa', '$2b$10$e8O0aN0.P.4e7k6v/4y6h.L24hJ3sJ2s5J0J0J0J0J0J0J0J0J0J0', 'siswa', 'aktif');

INSERT INTO siswa (user_id, nis, kelas, rombel, jurusan) VALUES
(5, '1001', 'XI', 'XI-IPA-1', 'IPA'),
(6, '1002', 'XI', 'XI-IPA-2', 'IPA'),
(7, '1003', 'XI', 'XI-IPS-1', 'IPS'),
(8, '1004', 'XI', 'XI-IPS-2', 'IPS'),
(9, '1005', 'X', 'X-1', 'Umum');

INSERT INTO calon_ketua (ketua_id, wakil_id, nomor_urut, visi, misi, foto, status) VALUES
(1, 2, 1, 'Mewujudkan OSIS yang responsif, inklusif, dan inovatif', '1. Mengadakan kegiatan akademik & non-akademik berprestasi\n2. Meningkatkan disiplin dan solidaritas siswa', 'paslon1.jpg', 'aktif'),
(3, 4, 2, 'Mengembangkan kreativitas dan karakter kepemimpinan siswa', '1. Modernisasi dan digitalisasi kegiatan siswa\n2. Mengadakan pelatihan kepemimpinan dan kewirausahaan', 'paslon2.jpg', 'aktif');

INSERT INTO hasil_voting (calon_id, total_suara) VALUES
(1, 0),
(2, 0);

INSERT INTO periode_pemilihan (nama_periode, tanggal_mulai, tanggal_selesai, status) VALUES
('Pemilihan Ketua OSIS Periode 2026/2027', '2026-08-01', '2026-08-10', 'aktif');

INSERT INTO pengumuman (judul, isi, dibuat_oleh) VALUES
('Pengumuman Pemilihan Ketua OSIS', 'Pemilihan Ketua dan Wakil Ketua OSIS telah dibuka. Gunakan hak pilih Anda!', 2);
