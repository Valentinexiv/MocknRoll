import { PrismaClient } from '../src/generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  const teams = await prisma.team.count();
  const prospects = await prisma.prospect.count();
  console.log(JSON.stringify({ teams, prospects }));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


