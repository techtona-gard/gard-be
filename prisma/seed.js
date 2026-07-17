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
    { role_id: 1, name: 'user' },
    { role_id: 2, name: 'verifier' },
    { role_id: 3, name: 'doctor' },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { role_id: role.role_id },
      update: { name: role.name },
      create: { role_id: role.role_id, name: role.name },
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
