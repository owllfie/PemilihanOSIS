const {
  pgEnum,
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  date,
} = require('drizzle-orm/pg-core');

const roleType = pgEnum('role_type', [
  'superadmin',
  'admin',
  'siswa',
  'calon_ketua',
  'calon_anggota',
  'pembina',
  'kepala_sekolah',
]);

const statusAktifType = pgEnum('status_aktif_type', ['aktif', 'nonaktif']);
const statusSeleksiType = pgEnum('status_seleksi_type', ['Menunggu', 'Lulus', 'Tidak Lulus']);
const statusPeriodeType = pgEnum('status_periode_type', ['aktif', 'selesai']);

const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleType('role').notNull(),
  status: statusAktifType('status').notNull().default('aktif'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

const siswa = pgTable('siswa', {
  siswa_id: serial('siswa_id').primaryKey(),
  user_id: integer('user_id').references(() => users.user_id, { onDelete: 'cascade' }).unique(),
  nis: varchar('nis', { length: 20 }).notNull().unique(),
  kelas: varchar('kelas', { length: 20 }).notNull(),
  rombel: varchar('rombel', { length: 20 }).notNull(),
  jurusan: varchar('jurusan', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

const calonKetua = pgTable('calon_ketua', {
  calon_id: serial('calon_id').primaryKey(),
  ketua_id: integer('ketua_id').notNull().references(() => siswa.siswa_id, { onDelete: 'cascade' }),
  wakil_id: integer('wakil_id').notNull().references(() => siswa.siswa_id, { onDelete: 'cascade' }),
  nomor_urut: integer('nomor_urut').notNull().unique(),
  visi: text('visi'),
  misi: text('misi'),
  foto: varchar('foto', { length: 255 }),
  status: statusAktifType('status').notNull().default('aktif'),
});

const voting = pgTable('voting', {
  voting_id: serial('voting_id').primaryKey(),
  siswa_id: integer('siswa_id').notNull().references(() => siswa.siswa_id, { onDelete: 'cascade' }).unique(),
  calon_id: integer('calon_id').notNull().references(() => calonKetua.calon_id, { onDelete: 'cascade' }),
  waktu_vote: timestamp('waktu_vote', { withTimezone: true }).defaultNow(),
});

const calonAnggotaOsis = pgTable('calon_anggota_osis', {
  pendaftaran_id: serial('pendaftaran_id').primaryKey(),
  siswa_id: integer('siswa_id').notNull().references(() => siswa.siswa_id, { onDelete: 'cascade' }),
  alasan: text('alasan'),
  status: statusSeleksiType('status').notNull().default('Menunggu'),
  tanggal_daftar: date('tanggal_daftar').defaultNow(),
});

const hasilVoting = pgTable('hasil_voting', {
  hasil_id: serial('hasil_id').primaryKey(),
  calon_id: integer('calon_id').notNull().references(() => calonKetua.calon_id, { onDelete: 'cascade' }).unique(),
  total_suara: integer('total_suara').notNull().default(0),
});

const periodePemilihan = pgTable('periode_pemilihan', {
  periode_id: serial('periode_id').primaryKey(),
  nama_periode: varchar('nama_periode', { length: 100 }).notNull(),
  tanggal_mulai: date('tanggal_mulai').notNull(),
  tanggal_selesai: date('tanggal_selesai').notNull(),
  status: statusPeriodeType('status').notNull().default('aktif'),
});

const pengumuman = pgTable('pengumuman', {
  pengumuman_id: serial('pengumuman_id').primaryKey(),
  judul: varchar('judul', { length: 100 }).notNull(),
  isi: text('isi').notNull(),
  dibuat_oleh: integer('dibuat_oleh').references(() => users.user_id, { onDelete: 'set null' }),
  tanggal: timestamp('tanggal', { withTimezone: true }).defaultNow(),
});

module.exports = {
  roleType,
  statusAktifType,
  statusSeleksiType,
  statusPeriodeType,
  users,
  siswa,
  calonKetua,
  voting,
  calonAnggotaOsis,
  hasilVoting,
  periodePemilihan,
  pengumuman,
};
