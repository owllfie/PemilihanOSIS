const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.user.findMany({
      select: {
        user_id: true,
        nama: true,
        username: true,
        role: true,
        status: true,
        created_at: true,
        siswa: { select: { nis: true, kelas: true } },
      },
      orderBy: { user_id: 'asc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { nama, username, password, role, status } = req.body;

    if (!nama || !username || !password || !role) {
      return res.status(400).json({ error: 'Nama, username, password, dan role wajib diisi.' });
    }

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role,
        status: status || 'aktif',
      },
    });

    res.status(201).json({ message: 'User berhasil dibuat.', user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, username, password, role, status } = req.body;

    const user = await db.user.findUnique({ where: { user_id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const updateData = {};
    if (nama) updateData.nama = nama;
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await db.user.update({
      where: { user_id: parseInt(id) },
      data: updateData,
    });

    res.json({ message: 'User berhasil diperbarui.', user: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json({ error: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    }

    await db.user.delete({ where: { user_id: parseInt(id) } });
    res.json({ message: 'User berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};
