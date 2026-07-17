import { HistoryModel } from '../models/history.model.js';

// POST /api/v1/histories
export const createHistory = async (req, res, next) => {
  try {
    const {
      user_id,
      category,
      history_date,
      description,
      severity_level,
      doctor_name,
      doctor_title,
      gerdq_score,
    } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const validCategories = ['DETEKSI', 'KONSULTASI', 'KUESIONER'];
    if (!category || !validCategories.includes(category)) {
      const error = new Error('Kategori riwayat tidak valid. Harus salah satu dari: DETEKSI, KONSULTASI, KUESIONER');
      error.statusCode = 400;
      return next(error);
    }

    const data = {
      user_id,
      category,
      history_date: history_date ? new Date(history_date) : new Date(),
      description: description || null,
      severity_level: category === 'DETEKSI' ? severity_level || null : null,
      doctor_name: category === 'KONSULTASI' ? doctor_name || null : null,
      doctor_title: category === 'KONSULTASI' ? doctor_title || null : null,
      gerdq_score: category === 'KUESIONER' && gerdq_score !== undefined ? parseInt(gerdq_score, 10) : null,
    };

    const history = await HistoryModel.create(data);

    res.status(201).json({
      status: 'success',
      data: history,
    });
  } catch (err) {
    if (err.code === 'P2003') {
      const error = new Error('User ID yang dimasukkan tidak valid');
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

// GET /api/v1/histories/user/:userId
export const getHistoriesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const histories = await HistoryModel.findByUserId(userId);

    res.status(200).json({
      status: 'success',
      data: histories,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/histories/:id
export const deleteHistory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      const error = new Error('ID riwayat tidak valid');
      error.statusCode = 400;
      return next(error);
    }

    await HistoryModel.delete(id);

    res.status(200).json({
      status: 'success',
      message: 'Riwayat berhasil dihapus',
    });
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('Riwayat tidak ditemukan');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};
