import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  type ColumnMeta<TData> = {
    label?: string;
  };
}
