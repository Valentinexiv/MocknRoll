import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const take = Number(searchParams.get('take') || '200');
  const q = (searchParams.get('q') || '').trim();
  const position = (searchParams.get('position') || '').trim();
  const sort = (searchParams.get('sort') || 'grade').trim();

  const andFilters: any[] = [];
  if (q) {
    andFilters.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
        { college: { contains: q, mode: 'insensitive' } }
      ]
    });
  }
  if (position) {
    andFilters.push({ position: { equals: position } });
  }
  const where = andFilters.length > 0 ? { AND: andFilters } : undefined;

  const prospects = await prisma.prospect.findMany({
    where,
    take,
    orderBy: sort === 'grade' ? [{ mnrGrade: 'desc' as const }, { rank: 'asc' as const }] : [{ rank: 'asc' as const }]
  });
  return NextResponse.json(prospects);
}


