import { prisma } from '../config/database.js';

export const MedicalGuidelineModel = {
  matchGuidelines: async (embeddingString, limitInt) => {
    return prisma.$queryRaw`
      SELECT id, content, metadata, similarity 
      FROM match_medical_guidelines(
        ${embeddingString}::vector, 
        0.0::double precision, 
        ${limitInt}::integer
      )
    `;
  },

  bulkUpsertGuidelines: async (records) => {
    return prisma.$transaction(
      records.map((record) => {
        const { id, content, metadata, embedding } = record;

        if (!id || !content || !embedding || !Array.isArray(embedding)) {
          throw new Error(`Record dengan ID "${id || 'unknown'}" memiliki format data yang tidak lengkap.`);
        }

        const embeddingString = `[${embedding.join(',')}]`;
        const metadataString = metadata ? JSON.stringify(metadata) : null;

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
  },
};
