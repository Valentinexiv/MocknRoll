import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

type ProspectCsvRow = {
  Rank: string;
  Name: string;
  Pos: string;
  Age: string;
  Proj: string;
  Archetype: string;
  College: string;
  'College Logo': string;
  Height: string;
  Weight: string;
  'MnR Grade': string;
};

const NFL_TEAMS: Array<{ name: string; abbreviation: string; city: string; logoUrl?: string; primaryColor?: string; secondaryColor?: string }> = [
  { name: 'Cardinals', abbreviation: 'ARI', city: 'Arizona' },
  { name: 'Falcons', abbreviation: 'ATL', city: 'Atlanta' },
  { name: 'Ravens', abbreviation: 'BAL', city: 'Baltimore' },
  { name: 'Bills', abbreviation: 'BUF', city: 'Buffalo' },
  { name: 'Panthers', abbreviation: 'CAR', city: 'Carolina' },
  { name: 'Bears', abbreviation: 'CHI', city: 'Chicago' },
  { name: 'Bengals', abbreviation: 'CIN', city: 'Cincinnati' },
  { name: 'Browns', abbreviation: 'CLE', city: 'Cleveland' },
  { name: 'Cowboys', abbreviation: 'DAL', city: 'Dallas' },
  { name: 'Broncos', abbreviation: 'DEN', city: 'Denver' },
  { name: 'Lions', abbreviation: 'DET', city: 'Detroit' },
  { name: 'Packers', abbreviation: 'GB', city: 'Green Bay' },
  { name: 'Texans', abbreviation: 'HOU', city: 'Houston' },
  { name: 'Colts', abbreviation: 'IND', city: 'Indianapolis' },
  { name: 'Jaguars', abbreviation: 'JAX', city: 'Jacksonville' },
  { name: 'Chiefs', abbreviation: 'KC', city: 'Kansas City' },
  { name: 'Raiders', abbreviation: 'LV', city: 'Las Vegas' },
  { name: 'Chargers', abbreviation: 'LAC', city: 'Los Angeles' },
  { name: 'Rams', abbreviation: 'LAR', city: 'Los Angeles' },
  { name: 'Dolphins', abbreviation: 'MIA', city: 'Miami' },
  { name: 'Vikings', abbreviation: 'MIN', city: 'Minnesota' },
  { name: 'Patriots', abbreviation: 'NE', city: 'New England' },
  { name: 'Saints', abbreviation: 'NO', city: 'New Orleans' },
  { name: 'Giants', abbreviation: 'NYG', city: 'New York' },
  { name: 'Jets', abbreviation: 'NYJ', city: 'New York' },
  { name: 'Eagles', abbreviation: 'PHI', city: 'Philadelphia' },
  { name: 'Steelers', abbreviation: 'PIT', city: 'Pittsburgh' },
  { name: '49ers', abbreviation: 'SF', city: 'San Francisco' },
  { name: 'Seahawks', abbreviation: 'SEA', city: 'Seattle' },
  { name: 'Buccaneers', abbreviation: 'TB', city: 'Tampa Bay' },
  { name: 'Titans', abbreviation: 'TEN', city: 'Tennessee' },
  { name: 'Commanders', abbreviation: 'WAS', city: 'Washington' }
];

async function seedTeams() {
  for (const t of NFL_TEAMS) {
    await prisma.team.upsert({
      where: { abbreviation: t.abbreviation },
      update: { name: t.name, city: t.city, logoUrl: t.logoUrl, primaryColor: t.primaryColor, secondaryColor: t.secondaryColor },
      create: { name: t.name, abbreviation: t.abbreviation, city: t.city, logoUrl: t.logoUrl, primaryColor: t.primaryColor, secondaryColor: t.secondaryColor }
    });
  }
}

async function seedProspectsFromCsv(csvPath: string) {
  const parser = fs
    .createReadStream(csvPath)
    .pipe(
      parse({
        bom: true,
        columns: (headers: string[]): string[] => headers.map((h: string) => h.trim()),
        skip_empty_lines: true,
        trim: true
      })
    );

  let rowIndex = 0;
  for await (const record of parser as AsyncIterable<ProspectCsvRow>) {
    rowIndex += 1;
    const parsedRank = Number.parseInt((record as any).Rank ?? '', 10);
    const rank = Number.isFinite(parsedRank) ? parsedRank : rowIndex;
    const age = record.Age ? Number(record.Age) : undefined;
    const weight = record.Weight ? Number(record.Weight) : undefined;
    const mnrGrade = record['MnR Grade'] ? Number(record['MnR Grade']) : undefined;

    await prisma.prospect.create({
      data: {
        rank,
        name: record.Name,
        position: record.Pos,
        age,
        projection: record.Proj || null,
        archetype: record.Archetype || null,
        college: record.College || null,
        collegeLogoUrl: record['College Logo'] || null,
        height: record.Height || null,
        weight,
        mnrGrade
      }
    });
  }
}

async function main() {
  await seedTeams();
  const csvPath = path.resolve(__dirname, '../../Top 50 prospects.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Prospects CSV not found at ${csvPath}`);
  }
  await prisma.prospect.deleteMany();
  await seedProspectsFromCsv(csvPath);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


