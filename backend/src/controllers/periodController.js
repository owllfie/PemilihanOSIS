const prisma = require('../config/prisma');

exports.getAllPeriods = async (req, res, next) => {
  try {
    const periods = await prisma.periodePemilihan.findMany({
      orderBy: { periode_id: 'desc' },
    });
    res.json(periods);
  } catch (err) {
    next(err);
  }
};

exports.getActivePeriod = async (req, res, next) => {
  try {
    const activePeriod = await prisma.periodePemilihan.findFirst({
      where: { status: 'aktif' },
    });
    res.json({ active_period: activePeriod || null });
  } catch (err) {
    next(err);
  }
};

exports.createPeriod = async (req, res, next) => {
  try {
    const { nama_periode, tanggal_mulai, tanggal_selesai, status } = req.body;

    if (!nama_periode || !tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({ error: 'Nama periode, tanggal mulai, dan tanggal selesai wajib diisi.' });
    }

    // If new status is aktif, set all other periods to selesai
    if (status === 'aktif') {
      await prisma.periodePemilihan.updateMany({
        data: { status: 'selesai' },
      });
    }

    const newPeriod = await prisma.periodePemilihan.create({
      data: {
        nama_periode,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        status: status || 'aktif',
      },
    });

    res.status(201).json({ message: 'Periode pemilihan berhasil dibuat.', period: newPeriod });
  } catch (err) {
    next(err);
  }
};

exports.updatePeriodStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'aktif' or 'selesai'

    if (!['aktif', 'selesai'].includes(status)) {
      return res.status(400).json({ error: 'Status harus aktif atau selesai.' });
    }

    if (status === 'aktif') {
      // Deactivate other active periods
      await prisma.periodePemilihan.updateMany({
        where: { periode_id: { not: parseInt(id) } },
        data: { status: 'selesai' },
      });
    }

    const updated = await prisma.periodePemilihan.update({
      where: { periode_id: parseInt(id) },
      data: { status },
    });

    res.json({ message: `Status periode berhasil diubah menjadi ${status}.`, period: updated });
  } catch (err) {
    next(err);
  }
};
