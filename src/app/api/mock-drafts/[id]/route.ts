import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type PickUpdate = { pickNumber: number; prospectId?: number | null; commentary?: string | null };

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const draft = await prisma.mockDraft.findUnique({
    where: { id },
    include: {
      picks: {
        orderBy: { pickNumber: 'asc' },
        include: { team: true, prospect: true }
      }
    }
  });
  if (!draft) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(draft);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { title, authorName, description, picks }: { title?: string; authorName?: string; description?: string; picks?: PickUpdate[] } = body;

  const draft = await prisma.mockDraft.update({
    where: { id },
    data: {
      title: title ?? undefined,
      authorName: authorName ?? undefined,
      description: description ?? undefined
    }
  });

  if (Array.isArray(picks) && picks.length > 0) {
    for (const p of picks) {
      await prisma.pick.update({
        where: { mockDraftId_pickNumber: { mockDraftId: id, pickNumber: p.pickNumber } },
        data: {
          prospectId: p.prospectId === null ? null : p.prospectId ?? undefined,
          commentary: p.commentary === null ? null : p.commentary ?? undefined
        }
      });
    }
  }

  const updated = await prisma.mockDraft.findUnique({
    where: { id },
    include: { picks: { orderBy: { pickNumber: 'asc' }, include: { team: true, prospect: true } } }
  });
  return NextResponse.json(updated);
}


