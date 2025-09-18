import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(teams);
}


