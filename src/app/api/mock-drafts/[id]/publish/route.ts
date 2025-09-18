import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.mockDraft.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const draft = await prisma.mockDraft.update({
    where: { id: params.id },
    data: { isPublished: true, publishedAt: new Date() }
  });
  return NextResponse.json(draft);
}


