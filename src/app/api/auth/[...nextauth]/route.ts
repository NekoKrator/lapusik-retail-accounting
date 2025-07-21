import 'dotenv/config';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

import type { JWT } from "next-auth/jwt"
import type { Session, User, SessionStrategy } from "next-auth"

const prisma = new PrismaClient()

export const authOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: Number(process.env.NEXTAUTH_JWT_MAX_AGE)
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Логін відділення магазину', type: 'text', placeholder: 'Введіть логін відділення магазину' },
        password: { label: 'Пароль', type: 'password', placeholder: 'Введіть пароль відділення магазину' }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })
        if (!user) {
          return null
        }

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) {
          return null
        }

        return { id: user.id, username: user.username, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: { session: Session, token: JWT }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          role: token.role as string,
        }
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)