const db = require('../config/db');

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await db.pengumuman.findMany({
      include: {
        creator: {
          select: { nama: true, role: true },
        },
      },
      orderBy: { tanggal: 'desc' },
    });
    res.json(announcements);
  } catch (err) {
    next(err);
  }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { judul, isi } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({ error: 'Judul dan isi pengumuman wajib diisi.' });
    }

    const announcement = await db.pengumuman.create({
      data: {
        judul,
        isi,
        dibuat_oleh: req.user.user_id,
      },
      include: {
        creator: { select: { nama: true, role: true } },
      },
    });

    res.status(201).json({ message: 'Pengumuman berhasil dibuat.', announcement });
  } catch (err) {
    next(err);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.pengumuman.delete({
      where: { pengumuman_id: parseInt(id) },
    });
    res.json({ message: 'Pengumuman berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};
