import { LifestyleModel } from '../models/lifestyle.model.js';

// POST /api/v1/lifestyles
export const createLifestyle = async (req, res, next) => {
  try {
    const { user_id, step, heartrate, sleep, recorded_at } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const data = {
      user_id,
      step: step !== undefined ? parseInt(step, 10) : null,
      heartrate: heartrate !== undefined ? parseInt(heartrate, 10) : null,
      sleep: sleep !== undefined ? parseFloat(sleep) : null,
      ...(recorded_at && { recorded_at: new Date(recorded_at) }),
    };

    const lifestyle = await LifestyleModel.create(data);

    res.status(201).json({
      status: 'success',
      data: lifestyle,
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
