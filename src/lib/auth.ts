import 'dotenv/config';
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import type { User } from '@/types/types'
import bcrypt from 'bcrypt'

import type { JWT } from "next-auth/jwt"
import type { Session, SessionStrategy } from "next-auth"

const prisma = new PrismaClient()

export const authOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: Number(process.env.NEXTAUTH_JWT_MAX_AGE),
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Логін відділення магазину', type: 'text', placeholder: 'Введіть логін відділення магазину' },
        password: { label: 'Пароль', type: 'password', placeholder: 'Введіть пароль відділення магазину' }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error('User not found')
        }
        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) {
          throw new Error('Invalid password')
        }

        return { id: user.id, username: user.username, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User;
    }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
