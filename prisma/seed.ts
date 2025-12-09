import "dotenv/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Role = "user" | "admin" | ("user" | "admin")[] | undefined;

async function main() {
  const users = [
    {
      name: "lapusik1",
      email: "lapusik1@example.com",
      password: process.env.SEED_PASSWORD_LAPUSIK1,
      username: "lapusik1",
      role: "user" as Role,
    },
    {
      name: "lapusik2",
      email: "lapusik2@example.com",
      password: process.env.SEED_PASSWORD_LAPUSIK2,
      username: "lapusik2",
      role: "user" as Role,
    },
    {
      name: "admin",
      email: "admin@example.com",
      password: process.env.SEED_PASSWORD_ADMIN,
      username: "admin",
      role: "admin" as Role,
    },
  ];

  for (const user of users) {
    console.log(`Creating user ${user.username}`);

    if (user.password) {
      await auth.api.createUser({
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role,
          data: {
            username: user.username,
          },
        },
      });
    } else {
      throw new Error(
        `Password not found for user: ${user.username}. User creation aborted.`
      );
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
