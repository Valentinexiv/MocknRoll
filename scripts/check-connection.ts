import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const nowResult = await prisma.$queryRawUnsafe<{ now: Date; version: string }[]>(
    'select now() as now, version() as version'
  );

  let teamOk = false;
  try {
    await prisma.$queryRawUnsafe('select 1 from "Team" limit 1');
    teamOk = true;
  } catch {
    teamOk = false;
  }

  console.log(
    JSON.stringify(
      {
        connected: true,
        now: nowResult?.[0]?.now ?? null,
        version: nowResult?.[0]?.version ?? null,
        teamTableAccessible: teamOk
      },
      null,
      2
    )
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Connection check failed:', err);
  process.exit(1);
});


