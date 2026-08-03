const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await prisma.siswa.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            nama: true,
            username: true,
            role: true,
            status: true,
          },
        },
      },
      orderBy: { siswa_id: 'desc' },
    });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await prisma.siswa.findUnique({
      where: { siswa_id: parseInt(id) },
      include: {
        user: {
          select: {
            user_id: true,
            nama: true,
            username: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { nama, username, password, nis, kelas, rombel, jurusan } = req.body;

    if (!nama || !username || !password || !nis || !kelas || !rombel) {
      return res.status(400).json({ error: 'Nama, username, password, NIS, kelas, dan rombel wajib diisi.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    const existingNis = await prisma.siswa.findUnique({ where: { nis } });
    if (existingNis) {
      return res.status(400).json({ error: 'NIS sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          nama,
          username,
          password: hashedPassword,
          role: 'siswa',
          status: 'aktif',
        },
      });

      const newSiswa = await tx.siswa.create({
        data: {
          user_id: newUser.user_id,
          nis,
          kelas,
          rombel,
          jurusan: jurusan || null,
        },
        include: { user: true },
      });

      return newSiswa;
    });

    res.status(201).json({ message: 'Data siswa berhasil ditambahkan.', student: result });
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, username, password, nis, kelas, rombel, jurusan, status } = req.body;

    const student = await prisma.siswa.findUnique({ where: { siswa_id: parseInt(id) } });
    if (!student) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    }

    const updateUserData = {};
    if (nama) updateUserData.nama = nama;
    if (username) updateUserData.username = username;
    if (status) updateUserData.status = status;
    if (password) {
      updateUserData.password = await bcrypt.hash(password, 10);
    }

    const updateSiswaData = {};
    if (nis) updateSiswaData.nis = nis;
    if (kelas) updateSiswaData.kelas = kelas;
    if (rombel) updateSiswaData.rombel = rombel;
    if (jurusan !== undefined) updateSiswaData.jurusan = jurusan;

    const result = await prisma.$transaction(async (tx) => {
      if (Object.keys(updateUserData).length > 0) {
        await tx.user.update({
          where: { user_id: student.user_id },
          data: updateUserData,
        });
      }

      const updatedSiswa = await tx.siswa.update({
        where: { siswa_id: parseInt(id) },
        data: updateSiswaData,
        include: { user: true },
      });

      return updatedSiswa;
    });

    res.json({ message: 'Data siswa berhasil diperbarui.', student: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await prisma.siswa.findUnique({ where: { siswa_id: parseInt(id) } });
    if (!student) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    }

    // Deleting user will cascade delete siswa record
    await prisma.user.delete({ where: { user_id: student.user_id } });

    res.json({ message: 'Data siswa berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};
