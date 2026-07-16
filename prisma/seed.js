import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding roles...');

  const roles = [
    { id: 1, name: 'user', description: 'User biasa' },
    { id: 2, name: 'verifier', description: 'Verifier' },
    { id: 3, name: 'doctor', description: 'Dokter' },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { id: role.id },
      update: { name: role.name, description: role.description },
      create: { id: role.id, name: role.name, description: role.description },
    });
    console.log(`  ✅ Role "${role.name}" seeded`);
  }

  console.log('✅ Seeding selesai!');
}

main()
  .catch((err) => {
    console.error('❌ Seed gagal:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
