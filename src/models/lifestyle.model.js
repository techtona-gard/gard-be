import { prisma } from '../config/database.js';

export const LifestyleModel = {
  create: async (data) => {
    return prisma.lifestyles.create({
      data,
    });
  },
};  
