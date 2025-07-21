import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const errorResponse = NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return errorResponse
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return errorResponse
    }

    return NextResponse.json({ username: user.username, role: user.role })
  } catch (e) {
    console.log('Auth error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}