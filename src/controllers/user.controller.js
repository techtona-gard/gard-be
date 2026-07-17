import { UserModel } from '../models/user.model.js';

// GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
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

    const user = await UserModel.findById(id);

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
    const { user_id, role_id, height, weight, birth_date, emergency_wa, status_gerd } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const user = await UserModel.create({
      user_id,
      role_id: role_id ? parseInt(role_id) : null,
      height: height ? parseInt(height) : null,
      weight: weight ? parseFloat(weight) : null,
      birth_date: birth_date ? new Date(birth_date) : null,
      emergency_wa: emergency_wa || null,
      status_gerd: status_gerd || null,
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
    if (err.code === 'P2003') {
      const error = new Error('Role ID yang dimasukkan tidak valid');
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_id, height, weight, birth_date, emergency_wa, status_gerd } = req.body;

    const user = await UserModel.update(id, {
      ...(role_id !== undefined && { role_id: role_id ? parseInt(role_id) : null }),
      ...(height !== undefined && { height: height ? parseInt(height) : null }),
      ...(weight !== undefined && { weight: weight ? parseFloat(weight) : null }),
      ...(birth_date !== undefined && { birth_date: birth_date ? new Date(birth_date) : null }),
      ...(emergency_wa !== undefined && { emergency_wa: emergency_wa || null }),
      ...(status_gerd !== undefined && { status_gerd: status_gerd || null }),
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
    if (err.code === 'P2003') {
      const error = new Error('Role ID yang dimasukkan tidak valid');
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserModel.delete(id);

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
