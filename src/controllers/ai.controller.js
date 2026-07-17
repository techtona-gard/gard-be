import { GoogleGenerativeAI } from '@google/generative-ai';
import { MedicalGuidelineModel } from '../models/medical-guideline.model.js';
import 'dotenv/config';

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// GET /api/v1/ai/medical-guidelines
export const getMedicalGuidelines = async (req, res, next) => {
  try {
    const { query, limit = 2 } = req.query;

    if (!query) {
      const error = new Error('Query parameter wajib diisi');
      error.statusCode = 400;
      return next(error);
    }

    if (!genAI) {
      const error = new Error('GEMINI_API_KEY belum dikonfigurasi di server');
      error.statusCode = 500;
      return next(error);
    }

    // 1. Generate embedding using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    const result = await model.embedContent({
      content: { parts: [{ text: query }] },
      outputDimensionality: 768,
    });
    const embedding = result.embedding.values; // Array 768 dimensi

    // 2. Call RPC match_medical_guidelines
    const limitInt = parseInt(limit, 10) || 2;
    const embeddingString = `[${embedding.join(',')}]`;

    // match_threshold set to 0.0 to fetch best matches based on limit
    const matchedGuidelines = await MedicalGuidelineModel.matchGuidelines(
      embeddingString,
      limitInt,
    );

    // 3. Return array of content strings
    const contentStrings = matchedGuidelines.map((g) => g.content);

    res.status(200).json({
      status: 'success',
      data: contentStrings,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/ai/medical-guidelines/bulk
export const bulkIngestGuidelines = async (req, res, next) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      const error = new Error('Records wajib dikirimkan dalam bentuk array');
      error.statusCode = 400;
      return next(error);
    }

    // Perform upsert using Model
    await MedicalGuidelineModel.bulkUpsertGuidelines(records);

    res.status(200).json({
      status: 'success',
      message: `${records.length} records medical guidelines berhasil disimpan/di-upsert`,
    });
  } catch (err) {
    next(err);
  }
};
