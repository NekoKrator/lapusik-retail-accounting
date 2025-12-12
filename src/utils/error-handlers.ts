import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import type { ApiErrorResponse } from "@/types/api-errors";

export function handlePrismaError(err: unknown): NextResponse {
  console.log(err);
  if (err instanceof PrismaClientKnownRequestError) {
    let details: ApiErrorResponse;
    let status: number;

    switch (err.code) {
      case "P2002": {
        const target = Array.isArray(err.meta?.target)
          ? err.meta?.target.join(", ")
          : "";
        details = {
          error: `Запис із цим значенням ${target} вже існує.`,
        };
        status = 409;
        break;
      }
      case "P2003":
        details = {
          error:
            "Неможливо виконати операцію через відсутність пов'язаних даних.",
        };
        status = 400;
        break;
      case "P2025":
        details = {
          error: "Зазначений ресурс не знайдено.",
        };
        status = 404;
        break;

      default:
        details = { error: "Помилка бази даних. Спробуйте пізніше." };
        status = 500;
        break;
    }

    return NextResponse.json(details, { status });
  }

  return NextResponse.json(
    { error: "Невідома помилка сервера." },
    { status: 500 }
  );
}
