import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        args: {
          page?: number;
          limit?: number;
          where?: Prisma.Args<T, "findMany">["where"];
          orderBy?: Prisma.Args<T, "findMany">["orderBy"];
          include?: Prisma.Args<T, "findMany">["include"];
        } = {}
      ) {
        const page = args.page ?? 1;
        const limit = args.limit ?? 10;

        if (page < 1 || limit < 1) {
          throw new Error("Invalid pagination parameters");
        }

        const context = Prisma.getExtensionContext(this);

        // @ts-expect-error
        const total = await context.count({ where: args.where });
        // @ts-expect-error
        const items = await context.findMany({
          where: args.where,
          orderBy: args.orderBy,
          include: args.include,
          skip: (page - 1) * limit,
          take: limit,
        });

        return {
          page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
          items,
        };
      },
    },
  },
});

export { prisma };
