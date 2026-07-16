import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../config/database.js';

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
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values; // Array 768 dimensi

    // 2. Call RPC match_medical_guidelines using raw SQL query (to support vector parsing)
    const limitInt = parseInt(limit, 10) || 2;
    const embeddingString = `[${embedding.join(',')}]`;

    // match_threshold set to 0.0 to fetch best matches based on limit
    const matchedGuidelines = await prisma.$queryRaw`
      SELECT id, content, metadata, similarity 
      FROM match_medical_guidelines(
        ${embeddingString}::vector, 
        0.0::double precision, 
        ${limitInt}::integer
      )
    `;

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

    // Perform upsert using transaction to ensure all inserts succeed together
    await prisma.$transaction(
      records.map((record) => {
        const { id, content, metadata, embedding } = record;

        if (!id || !content || !embedding || !Array.isArray(embedding)) {
          throw new Error(`Record dengan ID "${id || 'unknown'}" memiliki format data yang tidak lengkap.`);
        }

        const embeddingString = `[${embedding.join(',')}]`;
        const metadataString = metadata ? JSON.stringify(metadata) : null;

        // Using raw SQL execute to support PgVector input since Prisma does not natively support the vector type
        return prisma.$executeRaw`
          INSERT INTO medical_guidelines (id, content, metadata, embedding)
          VALUES (
            ${id}, 
            ${content}, 
            ${metadataString ? JSON.parse(metadataString) : null}::jsonb, 
            ${embeddingString}::vector
          )
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            embedding = EXCLUDED.embedding
        `;
      })
    );

    res.status(200).json({
      status: 'success',
      message: `${records.length} records medical guidelines berhasil disimpan/di-upsert`,
    });
  } catch (err) {
    next(err);
  }
};
