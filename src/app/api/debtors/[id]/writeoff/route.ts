import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const { id } = params;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Debtor ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { amount } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const debtor = await prisma.debtor.findUnique({ where: { id } });
    if (!debtor || debtor.userId !== token.id) {
      return NextResponse.json({ error: 'Debtor not found or unauthorized' }, { status: 404 });
    }

    if (amount > debtor.amount) {
      return NextResponse.json({ error: 'Amount exceeds debtor balance' }, { status: 400 });
    }

    const updatedDebtor = await prisma.debtor.update({
      where: { id },
      data: {
        amount: debtor.amount - amount,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ updatedDebtor, amountWrittenOff: amount });
  } catch (error) {
    console.error('Failed to write off debt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
