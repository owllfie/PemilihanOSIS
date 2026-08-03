-- ============================================================
-- Database Schema for Sistem Informasi Pemilihan Ketua OSIS
-- Database Engine: PostgreSQL
-- File: backend/schema.sql
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

-- Custom ENUM Types
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

-- 1. Table: users
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

-- 2. Table: siswa
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

-- 3. Table: calon_ketua
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

-- 4. Table: voting
CREATE TABLE voting (
    voting_id SERIAL PRIMARY KEY,
    siswa_id INT UNIQUE NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    calon_id INT NOT NULL REFERENCES calon_ketua(calon_id) ON DELETE CASCADE,
    waktu_vote TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: calon_anggota_osis
CREATE TABLE calon_anggota_osis (
    pendaftaran_id SERIAL PRIMARY KEY,
    siswa_id INT NOT NULL REFERENCES siswa(siswa_id) ON DELETE CASCADE,
    alasan TEXT,
    status status_seleksi_type NOT NULL DEFAULT 'Menunggu',
    tanggal_daftar DATE DEFAULT CURRENT_DATE
);

-- 6. Table: hasil_voting
CREATE TABLE hasil_voting (
    hasil_id SERIAL PRIMARY KEY,
    calon_id INT UNIQUE NOT NULL REFERENCES calon_ketua(calon_id) ON DELETE CASCADE,
    total_suara INT NOT NULL DEFAULT 0
);

-- 7. Table: periode_pemilihan
CREATE TABLE periode_pemilihan (
    periode_id SERIAL PRIMARY KEY,
    nama_periode VARCHAR(100) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    status status_periode_type NOT NULL DEFAULT 'aktif'
);

-- 8. Table: pengumuman
CREATE TABLE pengumuman (
    pengumuman_id SERIAL PRIMARY KEY,
    judul VARCHAR(100) NOT NULL,
    isi TEXT NOT NULL,
    dibuat_oleh INT REFERENCES users(user_id) ON DELETE SET NULL,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Auto-update updated_at triggers
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
