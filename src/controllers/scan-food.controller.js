import { AGENT_BASE_URL } from '../config/agent.js';

// POST /api/v1/scan-food
export const scanFood = async (req, res, next) => {
  try {
    const { thread_id, user_id, image_base64, chat_input } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    if (!image_base64) {
      const error = new Error('image_base64 wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const payload = {
      thread_id: thread_id || null,
      user_id,
      image_base64,
      chat_input: chat_input || null,
    };

    const response = await fetch(`${AGENT_BASE_URL}/api/v1/scan-food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data?.message || 'Gagal menghubungi AI agent');
      error.statusCode = response.status;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const error = new Error('AI agent tidak dapat dihubungi. Pastikan layanan tersedia.');
      error.statusCode = 503;
      return next(error);
    }
    next(err);
  }
};
