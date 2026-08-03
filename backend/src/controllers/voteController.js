const prisma = require('../config/prisma');

exports.vote = async (req, res, next) => {
  try {
    const { calon_id } = req.body;

    if (!calon_id) {
      return res.status(400).json({ error: 'Kandidat (calon_id) wajib dipilih.' });
    }

    // 1. Get logged-in student
    const siswa = await prisma.siswa.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!siswa) {
      return res.status(403).json({ error: 'Hanya siswa yang terdaftar yang dapat melakukan voting.' });
    }

    // 2. Check active election period
    const activePeriod = await prisma.periodePemilihan.findFirst({
      where: { status: 'aktif' },
    });

    if (!activePeriod) {
      return res.status(400).json({ error: 'Periode pemilihan tidak aktif atau belum dibuka.' });
    }

    // 3. Check if student already voted
    const existingVote = await prisma.voting.findUnique({
      where: { siswa_id: siswa.siswa_id },
    });

    if (existingVote) {
      return res.status(400).json({ error: 'Anda sudah menggunakan hak pilih. voting hanya dapat dilakukan satu kali.' });
    }

    // 4. Check candidate validity
    const candidate = await prisma.calonKetua.findUnique({
      where: { calon_id: parseInt(calon_id) },
    });

    if (!candidate || candidate.status !== 'aktif') {
      return res.status(404).json({ error: 'Kandidat tidak ditemukan atau status tidak aktif.' });
    }

    // 5. Transaction to save vote & update hasil_voting
    const result = await prisma.$transaction(async (tx) => {
      const newVote = await tx.voting.create({
        data: {
          siswa_id: siswa.siswa_id,
          calon_id: parseInt(calon_id),
        },
      });

      // Increment or upsert total_suara in hasil_voting
      await tx.hasilVoting.upsert({
        where: { calon_id: parseInt(calon_id) },
        update: { total_suara: { increment: 1 } },
        create: { calon_id: parseInt(calon_id), total_suara: 1 },
      });

      return newVote;
    });

    res.status(201).json({ message: 'Voting berhasil disimpan! Terima kasih atas partisipasi Anda.', vote: result });
  } catch (err) {
    next(err);
  }
};

exports.getVoteStatus = async (req, res, next) => {
  try {
    const siswa = await prisma.siswa.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!siswa) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    }

    const vote = await prisma.voting.findUnique({
      where: { siswa_id: siswa.siswa_id },
      include: {
        calon: {
          include: {
            ketua: { include: { user: { select: { nama: true } } } },
            wakil: { include: { user: { select: { nama: true } } } },
          },
        },
      },
    });

    const activePeriod = await prisma.periodePemilihan.findFirst({
      where: { status: 'aktif' },
    });

    res.json({
      voted: !!vote,
      vote_details: vote
        ? {
            voting_id: vote.voting_id,
            waktu_vote: vote.waktu_vote,
            calon: {
              calon_id: vote.calon.calon_id,
              nomor_urut: vote.calon.nomor_urut,
              nama_paslon: `${vote.calon.ketua?.user?.nama || ''} & ${vote.calon.wakil?.user?.nama || ''}`,
            },
          }
        : null,
      periode_aktif: activePeriod || null,
    });
  } catch (err) {
    next(err);
  }
};
