const prisma = require('../config/prisma');

exports.getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await prisma.calonKetua.findMany({
      include: {
        ketua: {
          include: {
            user: {
              select: { nama: true, username: true },
            },
          },
        },
        wakil: {
          include: {
            user: {
              select: { nama: true, username: true },
            },
          },
        },
        hasil_voting: true,
        _count: {
          select: { voting: true },
        },
      },
      orderBy: { nomor_urut: 'asc' },
    });

    const formatted = candidates.map((c) => ({
      calon_id: c.calon_id,
      nomor_urut: c.nomor_urut,
      ketua_id: c.ketua_id,
      ketua_nama: c.ketua?.user?.nama || 'Unknown',
      ketua_nis: c.ketua?.nis || '',
      ketua_kelas: c.ketua?.kelas || '',
      wakil_id: c.wakil_id,
      wakil_nama: c.wakil?.user?.nama || 'Unknown',
      wakil_nis: c.wakil?.nis || '',
      wakil_kelas: c.wakil?.kelas || '',
      visi: c.visi,
      misi: c.misi,
      foto: c.foto ? `/uploads/${c.foto}` : null,
      status: c.status,
      total_suara: c._count.voting,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

exports.getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.calonKetua.findUnique({
      where: { calon_id: parseInt(id) },
      include: {
        ketua: { include: { user: true } },
        wakil: { include: { user: true } },
        _count: { select: { voting: true } },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Kandidat tidak ditemukan.' });
    }

    res.json({
      ...candidate,
      total_suara: candidate._count.voting,
      foto: candidate.foto ? `/uploads/${candidate.foto}` : null,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCandidate = async (req, res, next) => {
  try {
    const { ketua_id, wakil_id, nomor_urut, visi, misi } = req.body;

    if (!ketua_id || !wakil_id || !nomor_urut) {
      return res.status(400).json({ error: 'Ketua, wakil, dan nomor urut wajib diisi.' });
    }

    if (parseInt(ketua_id) === parseInt(wakil_id)) {
      return res.status(400).json({ error: 'Ketua dan Wakil harus siswa yang berbeda.' });
    }

    const existingNo = await prisma.calonKetua.findUnique({
      where: { nomor_urut: parseInt(nomor_urut) },
    });

    if (existingNo) {
      return res.status(400).json({ error: 'Nomor urut sudah digunakan.' });
    }

    let fotoName = null;
    if (req.file) {
      fotoName = req.file.filename;
    }

    const newCandidate = await prisma.calonKetua.create({
      data: {
        ketua_id: parseInt(ketua_id),
        wakil_id: parseInt(wakil_id),
        nomor_urut: parseInt(nomor_urut),
        visi: visi || '',
        misi: misi || '',
        foto: fotoName,
        status: 'aktif',
      },
    });

    // Also update role user for ketua to calon_ketua
    const ketuaSiswa = await prisma.siswa.findUnique({ where: { siswa_id: parseInt(ketua_id) } });
    if (ketuaSiswa) {
      await prisma.user.update({
        where: { user_id: ketuaSiswa.user_id },
        data: { role: 'calon_ketua' },
      });
    }

    // Initialize hasil_voting
    await prisma.hasilVoting.create({
      data: {
        calon_id: newCandidate.calon_id,
        total_suara: 0,
      },
    });

    res.status(201).json({ message: 'Kandidat berhasil ditambahkan.', candidate: newCandidate });
  } catch (err) {
    next(err);
  }
};

exports.updateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ketua_id, wakil_id, nomor_urut, visi, misi, status } = req.body;

    const candidate = await prisma.calonKetua.findUnique({ where: { calon_id: parseInt(id) } });
    if (!candidate) {
      return res.status(404).json({ error: 'Kandidat tidak ditemukan.' });
    }

    const updateData = {};
    if (ketua_id) updateData.ketua_id = parseInt(ketua_id);
    if (wakil_id) updateData.wakil_id = parseInt(wakil_id);
    if (nomor_urut) updateData.nomor_urut = parseInt(nomor_urut);
    if (visi !== undefined) updateData.visi = visi;
    if (misi !== undefined) updateData.misi = misi;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.foto = req.file.filename;
    }

    const updatedCandidate = await prisma.calonKetua.update({
      where: { calon_id: parseInt(id) },
      data: updateData,
    });

    res.json({ message: 'Kandidat berhasil diperbarui.', candidate: updatedCandidate });
  } catch (err) {
    next(err);
  }
};

exports.deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.calonKetua.findUnique({ where: { calon_id: parseInt(id) } });
    if (!candidate) {
      return res.status(404).json({ error: 'Kandidat tidak ditemukan.' });
    }

    await prisma.calonKetua.delete({ where: { calon_id: parseInt(id) } });

    res.json({ message: 'Kandidat berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};

exports.getCandidateProfile = async (req, res, next) => {
  try {
    // Find candidate pair where logged-in user's siswa_id matches ketua or wakil
    const siswa = await prisma.siswa.findUnique({ where: { user_id: req.user.user_id } });
    if (!siswa) {
      return res.status(404).json({ error: 'Data siswa pengguna tidak ditemukan.' });
    }

    const candidate = await prisma.calonKetua.findFirst({
      where: {
        OR: [{ ketua_id: siswa.siswa_id }, { wakil_id: siswa.siswa_id }],
      },
      include: {
        ketua: { include: { user: true } },
        wakil: { include: { user: true } },
        _count: { select: { voting: true } },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Anda belum terdaftar sebagai calon ketua/wakil.' });
    }

    res.json({
      ...candidate,
      total_suara: candidate._count.voting,
      foto: candidate.foto ? `/uploads/${candidate.foto}` : null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCandidateProfile = async (req, res, next) => {
  try {
    const siswa = await prisma.siswa.findUnique({ where: { user_id: req.user.user_id } });
    if (!siswa) {
      return res.status(404).json({ error: 'Data siswa pengguna tidak ditemukan.' });
    }

    const candidate = await prisma.calonKetua.findFirst({
      where: {
        OR: [{ ketua_id: siswa.siswa_id }, { wakil_id: siswa.siswa_id }],
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Anda belum terdaftar sebagai calon.' });
    }

    const { visi, misi } = req.body;
    const updateData = {};
    if (visi !== undefined) updateData.visi = visi;
    if (misi !== undefined) updateData.misi = misi;

    if (req.file) {
      updateData.foto = req.file.filename;
    }

    const updated = await prisma.calonKetua.update({
      where: { calon_id: candidate.calon_id },
      data: updateData,
    });

    res.json({ message: 'Profil calon berhasil diperbarui.', candidate: updated });
  } catch (err) {
    next(err);
  }
};

exports.getCandidateResults = async (req, res, next) => {
  try {
    const candidates = await prisma.calonKetua.findMany({
      include: {
        ketua: { include: { user: { select: { nama: true } } } },
        wakil: { include: { user: { select: { nama: true } } } },
        _count: { select: { voting: true } },
      },
      orderBy: { nomor_urut: 'asc' },
    });

    const results = candidates.map((c) => ({
      calon_id: c.calon_id,
      nomor_urut: c.nomor_urut,
      nama_paslon: `${c.ketua?.user?.nama || 'Ketua'} & ${c.wakil?.user?.nama || 'Wakil'}`,
      total_suara: c._count.voting,
    }));

    res.json(results);
  } catch (err) {
    next(err);
  }
};
