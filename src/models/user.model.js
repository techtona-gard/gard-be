import { prisma } from '../config/database.js';

export const UserModel = {
  findAll: async () => {
    return prisma.users.findMany({
      orderBy: { created_at: 'desc' },
      include: { roles: true },
    });
  },

  findById: async (id) => {
    return prisma.users.findUnique({
      where: { user_id: id },
      include: { roles: true },
    });
  },

  create: async (data) => {
    return prisma.users.create({
      data,
    });
  },

  update: async (id, data) => {
    return prisma.users.update({
      where: { user_id: id },
      data,
    });
  },

  delete: async (id) => {
    return prisma.users.delete({
      where: { user_id: id },
    });
  },
};
