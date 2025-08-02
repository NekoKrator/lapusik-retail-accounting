import 'dotenv/config';
import { PrismaClient } from "@prisma/client"
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const users = [
    { username: 'lapusik1', password: process.env.SEED_PASSWORD_LAPUSIK1, role: 'user' },
    { username: 'lapusik2', password: process.env.SEED_PASSWORD_LAPUSIK2, role: 'user' },
    { username: 'admin', password: process.env.SEED_PASSWORD_ADMIN, role: 'admin' }
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password!, 10)
    await prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
        role: user.role
      }
    })
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.log(e)
  await prisma.$disconnect()
  process.exit(1)
})