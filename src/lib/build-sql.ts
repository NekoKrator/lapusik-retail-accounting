import { Prisma } from "@/generated/prisma/client";
import type { Filter } from "@/schemas/search/filter";

function processPrimitive(column: Prisma.Sql, value: unknown): Prisma.Sql {
  return Prisma.sql`${column} = ${value}`;
}

function processOperators(
  column: Prisma.Sql,
  value: Record<string, unknown>
): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [];
  for (const [op, opValue] of Object.entries(value)) {
    if (opValue == null) {
      continue;
    }

    switch (op) {
      case "gt":
        conditions.push(Prisma.sql`${column} > ${opValue}`);
        break;
      case "gte":
        conditions.push(Prisma.sql`${column} >= ${opValue}`);
        break;
      case "lt":
        conditions.push(Prisma.sql`${column} < ${opValue}`);
        break;
      case "lte":
        conditions.push(Prisma.sql`${column} <= ${opValue}`);
        break;
      default:
        break;
    }
  }
  return conditions;
}

export function splitFilters(
  filters: Filter[],
  columnMap: Record<string, unknown>
): {
  where: Filter[];
  having: Filter[];
} {
  const where: Filter[] = [];
  const having: Filter[] = [];

  for (const filter of filters) {
    if (filter.key in columnMap) {
      having.push(filter);
    } else {
      where.push(filter);
    }
  }

  return { where, having };
}

export function columnForField(
  field: string,
  tableAlias?: string,
  map?: Record<string, Prisma.Sql>
): Prisma.Sql {
  if (map?.[field]) {
    return map[field];
  }
  if (tableAlias) {
    return Prisma.raw(`"${tableAlias}"."${field}"`);
  }
  return Prisma.raw(`"${field}"`);
}

export function columnForHavingField(
  field: string,
  columnMap: Record<string, Prisma.Sql>
): Prisma.Sql {
  const column = columnMap[field];
  if (!column) {
    throw new Error(`Missing aggregated column for HAVING: ${field}`);
  }
  return column;
}

export function buildConditions(
  filters: Filter[],
  columnResolver: (field: string) => Prisma.Sql
): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [];

  for (const filter of filters) {
    const { key, value, operator } = filter;

    if (value == null) {
      continue;
    }

    const column = columnResolver(key);

    if (!operator || operator === "eq") {
      conditions.push(processPrimitive(column, value));
    } else {
      conditions.push(...processOperators(column, { [operator]: value }));
    }
  }

  return conditions;
}

export function buildWhereSQL(
  filters: Filter[],
  columnMap?: Record<string, Prisma.Sql>
): Prisma.Sql {
  const conditions = buildConditions(filters, (field) =>
    columnForField(field, undefined, columnMap)
  );

  return conditions.length
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}

export function buildHavingSQL(
  filters: Filter[],
  columnMap: Record<string, Prisma.Sql>
): Prisma.Sql {
  const conditions = buildConditions(filters, (field) =>
    columnForHavingField(field, columnMap)
  );

  return conditions.length
    ? Prisma.sql`HAVING ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}

export function buildOrderBySQL(
  field: string,
  order: "asc" | "desc",
  columnMap?: Record<string, Prisma.Sql>,
  tableAlias?: string
): Prisma.Sql {
  const column = columnForField(field, tableAlias, columnMap);
  return Prisma.sql`${column} ${order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`}`;
}
