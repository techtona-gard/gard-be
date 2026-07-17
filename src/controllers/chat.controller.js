import { AGENT_BASE_URL } from '../config/agent.js';

// POST /api/v1/chat
export const chat = async (req, res, next) => {
  try {
    const { thread_id, user_id, baseline_gerd_q, sensor_data, chat_input } = req.body;

    if (!user_id) {
      const error = new Error('user_id wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    if (!chat_input) {
      const error = new Error('chat_input wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    const payload = {
      thread_id: thread_id || null,
      user_id,
      baseline_gerd_q: baseline_gerd_q || null,
      sensor_data: sensor_data || null,
      chat_input,
    };

    const response = await fetch(`${AGENT_BASE_URL}/api/v1/chat`, {
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
