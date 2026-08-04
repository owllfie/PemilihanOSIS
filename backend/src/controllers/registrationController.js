const db = require('../config/db');

exports.registerCandidateMember = async (req, res, next) => {
  try {
    const { alasan } = req.body;

    const siswa = await db.siswa.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!siswa) {
      return res.status(403).json({ error: 'Hanya siswa terdaftar yang dapat mendaftar calon anggota OSIS.' });
    }

    const existingReg = await db.calonAnggotaOsis.findFirst({
      where: { siswa_id: siswa.siswa_id },
    });

    if (existingReg) {
      return res.status(400).json({ error: 'Anda sudah pernah mengirimkan pendaftaran calon anggota OSIS.' });
    }

    const registration = await db.calonAnggotaOsis.create({
      data: {
        siswa_id: siswa.siswa_id,
        alasan: alasan || '',
        status: 'Menunggu',
      },
      include: {
        siswa: { include: { user: { select: { nama: true } } } },
      },
    });

    res.status(201).json({ message: 'Pendaftaran berhasil dikirimkan.', registration });
  } catch (err) {
    next(err);
  }
};

exports.getRegistrationStatus = async (req, res, next) => {
  try {
    const siswa = await db.siswa.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!siswa) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    }

    const registration = await db.calonAnggotaOsis.findFirst({
      where: { siswa_id: siswa.siswa_id },
    });

    res.json({ registration: registration || null });
  } catch (err) {
    next(err);
  }
};

exports.getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await db.calonAnggotaOsis.findMany({
      include: {
        siswa: {
          include: {
            user: { select: { nama: true, username: true } },
          },
        },
      },
      orderBy: { pendaftaran_id: 'desc' },
    });

    res.json(registrations);
  } catch (err) {
    next(err);
  }
};

exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Menunggu', 'Lulus', 'Tidak Lulus'

    if (!['Menunggu', 'Lulus', 'Tidak Lulus', 'Tidak_Lulus'].includes(status)) {
      return res.status(400).json({ error: 'Status seleksi tidak valid. Pilih Menunggu, Lulus, atau Tidak Lulus.' });
    }

    const enumStatus = status === 'Tidak_Lulus' ? 'Tidak_Lulus' : status;

    const registration = await db.calonAnggotaOsis.update({
      where: { pendaftaran_id: parseInt(id) },
      data: { status: enumStatus },
      include: {
        siswa: { include: { user: true } },
      },
    });

    res.json({ message: 'Status seleksi pendaftaran berhasil diperbarui.', registration });
  } catch (err) {
    next(err);
  }
};
