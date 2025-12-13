"use server";

import { APIError } from "better-auth";
import { headers } from "next/headers";
import { auth } from "../auth";

type SignInSuccess = {
  token: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    username: string;
    displayUsername: string;
    name: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
} | null;

type SignInError = {
  status: string | number;
  code: string | number;
  message: string;
};

type SignInResult =
  | { ok: true; data: SignInSuccess }
  | { ok: false; error: SignInError };

export const signIn = async (
  username: string,
  password: string
): Promise<SignInResult> => {
  try {
    const result = await auth.api.signInUsername({
      body: {
        username,
        password,
      },
    });
    return { ok: true, data: result };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        ok: false,
        error: {
          status: error.status,
          code: error.statusCode,
          message: error.message,
        },
      };
    }
    return {
      ok: false,
      error: {
        status: "UNKNOWN_ERROR",
        code: 500,
        message: "Невідома помилка",
      },
    };
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
