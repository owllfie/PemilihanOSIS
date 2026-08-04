const db = require('../config/db');

exports.getStatistics = async (req, res, next) => {
  try {
    const totalSiswa = await db.siswa.count();
    const totalPemilih = await db.voting.count();
    const belumMemilih = totalSiswa - totalPemilih;
    const totalKandidat = await db.calonKetua.count();
    const totalPendaftarOsis = await db.calonAnggotaOsis.count();

    const candidates = await db.calonKetua.findMany({
      include: {
        ketua: { include: { user: { select: { nama: true } } } },
        wakil: { include: { user: { select: { nama: true } } } },
        _count: { select: { voting: true } },
      },
      orderBy: { nomor_urut: 'asc' },
    });

    const activePeriod = await db.periodePemilihan.findFirst({
      where: { status: 'aktif' },
    });

    const candidatesVotingData = candidates.map((c) => ({
      calon_id: c.calon_id,
      nomor_urut: c.nomor_urut,
      nama_paslon: `Paslon ${c.nomor_urut}: ${c.ketua?.user?.nama || 'Ketua'} & ${c.wakil?.user?.nama || 'Wakil'}`,
      total_suara: c._count.voting,
      persentase: totalPemilih > 0 ? ((c._count.voting / totalPemilih) * 100).toFixed(1) : 0,
    }));

    // Status pendaftaran OSIS
    const registationsByStatus = await db.calonAnggotaOsis.groupBy({
      by: ['status'],
      _count: { pendaftaran_id: true },
    });

    res.json({
      summary: {
        total_siswa: totalSiswa,
        total_pemilih: totalPemilih,
        belum_memilih: belumMemilih,
        partisipasi_persen: totalSiswa > 0 ? ((totalPemilih / totalSiswa) * 100).toFixed(1) : 0,
        total_kandidat: totalKandidat,
        total_pendaftar_osis: totalPendaftarOsis,
      },
      candidates: candidatesVotingData,
      periode_aktif: activePeriod,
      pendaftaran_status: registationsByStatus,
    });
  } catch (err) {
    next(err);
  }
};

exports.getReportData = async (req, res, next) => {
  try {
    const period = await db.periodePemilihan.findFirst({ orderBy: { periode_id: 'desc' } });
    const candidates = await db.calonKetua.findMany({
      include: {
        ketua: { include: { user: { select: { nama: true } } } },
        wakil: { include: { user: { select: { nama: true } } } },
        _count: { select: { voting: true } },
      },
      orderBy: { nomor_urut: 'asc' },
    });

    const totalSiswa = await db.siswa.count();
    const totalSuara = await db.voting.count();

    const report = {
      tanggal_cetak: new Date().toISOString(),
      periode: period ? period.nama_periode : 'Periode Pemilihan 2026',
      total_siswa: totalSiswa,
      total_suara_masuk: totalSuara,
      partisipasi: totalSiswa > 0 ? ((totalSuara / totalSiswa) * 100).toFixed(1) + '%' : '0%',
      kandidat_rekap: candidates.map((c) => ({
        nomor_urut: c.nomor_urut,
        ketua: c.ketua?.user?.nama || '-',
        wakil: c.wakil?.user?.nama || '-',
        suara: c._count.voting,
        persentase: totalSuara > 0 ? ((c._count.voting / totalSuara) * 100).toFixed(1) + '%' : '0%',
      })),
    };

    res.json(report);
  } catch (err) {
    next(err);
  }
};
