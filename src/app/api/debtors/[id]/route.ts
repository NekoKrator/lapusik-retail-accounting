import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Context = {
  params: {
    id: string;
  };
};

export async function DELETE(req: NextRequest, context: Context) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;

    const debtor = await prisma.debtor.findFirst({
      where: { id, userId: token.id as string },
    });

    if (!debtor) {
      return NextResponse.json({ error: 'Debtor not found' }, { status: 404 });
    }

    await prisma.debtor.delete({ where: { id } });

    return NextResponse.json({
      message: 'Debtor deleted successfully',
      debtAmount: debtor.amount,
      debtorName: debtor.name,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { amount } = body;

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: 'Invalid debt amount' }, { status: 400 });
    }

    const existingDebtor = await prisma.debtor.findFirst({
      where: {
        id,
        userId: token.id as string,
      },
    });

    if (!existingDebtor) {
      return NextResponse.json({ error: 'Debtor not found' }, { status: 404 });
    }

    const updatedDebtor = await prisma.debtor.update({
      where: { id },
      data: {
        amount,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDebtor);
  } catch (error) {
    console.error('Failed to update debtor:', error);
    return NextResponse.json({ error: 'Failed to update debtor' }, { status: 500 });
  }
}
