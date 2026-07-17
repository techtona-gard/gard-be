import { prisma } from '../config/database.js';

export const HistoryModel = {
  create: async (data) => {
    return prisma.histories.create({
      data,
    });
  },

  findByUserId: async (userId) => {
    return prisma.histories.findMany({
      where: { user_id: userId },
      orderBy: { history_date: 'desc' },
    });
  },

  delete: async (id) => {
    return prisma.histories.delete({
      where: { history_id: id },
    });
  },
};
