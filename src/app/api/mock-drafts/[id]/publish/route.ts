import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = await prisma.mockDraft.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const draft = await prisma.mockDraft.update({
    where: { id },
    data: { isPublished: true, publishedAt: new Date() }
  });
  return NextResponse.json(draft);
}


