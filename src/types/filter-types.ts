export type FilterOperatorValue = "eq" | "gt" | "gte" | "lt" | "lte";

export type FilterValueType = "text" | "number" | "date" | "boolean" | "enum";

export type FilterOperator = {
  value: FilterOperatorValue;
  label: string;
  sign: string;
};

export type TableFilter = {
  key: string;
  value: string;
  operator: FilterOperator;
  label: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  type: FilterValueType;

  operators?: FilterOperatorValue[];
  options?: FilterOption[];
};

export type DraftFilterRow = {
  id: string;
  config: FilterConfig;
  operator: FilterOperator;
  value: string;
};

export const FILTER_OPERATORS: FilterOperator[] = [
  { value: "eq", label: "дорівнює", sign: "=" },
  { value: "gt", label: "більше", sign: ">" },
  { value: "gte", label: "більше або дорівнює", sign: ">=" },
  { value: "lt", label: "менше", sign: "<" },
  { value: "lte", label: "менше або дорівнює", sign: "<=" },
];

export function buildFilterParams(filters: TableFilter[]) {
  return filters
    .filter((f) => f.value !== "")
    .map((f) => ({
      key: f.key,
      value: f.value,
      ...(f.operator.value !== "eq" && {
        operator: f.operator.value,
      }),
    }));
}
