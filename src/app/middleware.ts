import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_PATH = '/admin';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token.role !== 'admin') {
    const forbiddenUrl = new URL('/', req.url);
    return NextResponse.redirect(forbiddenUrl);
    // return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}