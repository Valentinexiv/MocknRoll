import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.mockDraft.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.pick.updateMany({ where: { mockDraftId: params.id }, data: { prospectId: null, commentary: null } });

  const updated = await prisma.mockDraft.findUnique({
    where: { id: params.id },
    include: { picks: { orderBy: { pickNumber: 'asc' }, include: { team: true, prospect: true } } }
  });

  return NextResponse.json(updated);
}


