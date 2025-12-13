import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, createAuthMiddleware, username } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  advanced: { disableOriginCheck: true },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const response = (await ctx.context.returned) as APIError;

      if (ctx.path.startsWith("/sign-up")) {
        throw new APIError("METHOD_NOT_ALLOWED", {
          message: "Endpoint not allowed",
        });
      }

      if (response?.body?.code === "INVALID_USERNAME_OR_PASSWORD") {
        throw new APIError("UNAUTHORIZED", {
          ...response.body,
          message: "Недійсне ім'я користувача або пароль",
        });
      }

      if (response?.body?.code === "USERNAME_IS_TOO_SHORT") {
        throw new APIError("BAD_REQUEST", {
          ...response.body,
          message: "Ім'я користувача занадто коротке",
        });
      }
    }),
  },

  plugins: [username(), admin(), nextCookies()],
});
