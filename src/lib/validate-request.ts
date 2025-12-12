import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type ValidationResult<TBody, TQuery> =
  | { error: NextResponse; data?: never }
  | {
      error?: never;
      data: {
        body: TBody;
        query: TQuery;
      };
    };

export function validateRequest<TBody, TQuery>({
  bodySchema,
  querySchema,
}: {
  bodySchema?: z.Schema<TBody>;
  querySchema?: z.Schema<TQuery>;
}): (req: NextRequest) => Promise<ValidationResult<TBody, TQuery>> {
  return async (req: NextRequest) => {
    let queryData: TQuery | undefined;
    if (querySchema) {
      const paramsObj = Object.fromEntries(req.nextUrl.searchParams.entries());
      const parsedQuery = querySchema.safeParse(paramsObj);

      if (!parsedQuery.success) {
        return {
          error: NextResponse.json(
            { error: z.flattenError(parsedQuery.error) },
            { status: 400 }
          ),
        } as ValidationResult<TBody, TQuery>;
      }

      queryData = parsedQuery.data;
    }

    let bodyData: TBody | undefined;
    if (bodySchema) {
      const json = await req.json();
      const parsedBody = bodySchema.safeParse(json);

      if (!parsedBody.success) {
        return {
          error: NextResponse.json(
            { error: z.flattenError(parsedBody.error) },
            { status: 400 }
          ),
        } as ValidationResult<TBody, TQuery>;
      }

      bodyData = parsedBody.data;
    }

    return { data: { body: bodyData, query: queryData } } as ValidationResult<
      TBody,
      TQuery
    >;
  };
}
