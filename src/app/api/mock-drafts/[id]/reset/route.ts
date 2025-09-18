import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = await prisma.mockDraft.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.pick.updateMany({ where: { mockDraftId: id }, data: { prospectId: null, commentary: null } });

  const updated = await prisma.mockDraft.findUnique({
    where: { id },
    include: { picks: { orderBy: { pickNumber: 'asc' }, include: { team: true, prospect: true } } }
  });

  return NextResponse.json(updated);
}


