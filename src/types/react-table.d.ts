import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  type TableMeta<TData, TUpdateData> = {
    onUpdate?: (id: string, payload: TUpdateData) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
  };

  type ColumnMeta<TData> = {
    label?: string;
  };
}
