import { prisma } from '../config/database.js';

// GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
      include: { roles: true },
    });
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { user_id: id },
      include: { roles: true },
    });

    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users
export const createUser = async (req, res, next) => {
  try {
    const { user_id, role_id, tinggi_badan, berat_badan, tanggal_lahir } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const user = await prisma.users.create({
      data: {
        user_id,
        role_id: role_id ? parseInt(role_id) : null,
        tinggi_badan: tinggi_badan ? parseInt(tinggi_badan) : null,
        berat_badan: berat_badan ? parseFloat(berat_badan) : null,
        tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      },
    });

    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'User ID';
      const error = new Error(`${field} sudah digunakan`);
      error.statusCode = 409;
      return next(error);
    }
    next(err);
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_id, tinggi_badan, berat_badan, tanggal_lahir } = req.body;

    const user = await prisma.users.update({
      where: { user_id: id },
      data: {
        ...(role_id !== undefined && { role_id: role_id ? parseInt(role_id) : null }),
        ...(tinggi_badan !== undefined && { tinggi_badan: tinggi_badan ? parseInt(tinggi_badan) : null }),
        ...(berat_badan !== undefined && { berat_badan: berat_badan ? parseFloat(berat_badan) : null }),
        ...(tanggal_lahir !== undefined && { tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null }),
      },
    });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('User tidak ditemukan');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.users.delete({
      where: { user_id: id },
    });

    res.status(200).json({
      status: 'success',
      message: 'User berhasil dihapus',
    });
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('User tidak ditemukan');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};
