import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const drafts = await prisma.mockDraft.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      authorName: true,
      description: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return NextResponse.json(drafts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    authorName,
    description,
    teamOrder
  }: { title: string; authorName?: string; description?: string; teamOrder: number[] } = body;

  if (!title || !Array.isArray(teamOrder) || teamOrder.length === 0) {
    return NextResponse.json({ error: 'title and teamOrder are required' }, { status: 400 });
  }

  const draft = await prisma.mockDraft.create({
    data: {
      title,
      authorName: authorName || null,
      description: description || null,
      picks: {
        create: teamOrder.map((teamId, idx) => ({ pickNumber: idx + 1, teamId }))
      }
    },
    include: { picks: true }
  });
  return NextResponse.json(draft, { status: 201 });
}


