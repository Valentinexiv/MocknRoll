import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const take = Number(searchParams.get('take') || '200');
  const q = (searchParams.get('q') || '').trim();
  const position = (searchParams.get('position') || '').trim();
  const sort = (searchParams.get('sort') || 'grade').trim();

  const where: Prisma.ProspectWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { position: { contains: q, mode: 'insensitive' } },
      { college: { contains: q, mode: 'insensitive' } }
    ];
  }
  if (position) {
    const current = Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : [];
    where.AND = [...current, { position: { equals: position } }];
  }

  const prospects = await prisma.prospect.findMany({
    where,
    take,
    orderBy: sort === 'grade' ? [{ mnrGrade: 'desc' as const }, { rank: 'asc' as const }] : [{ rank: 'asc' as const }]
  });
  return NextResponse.json(prospects);
}


