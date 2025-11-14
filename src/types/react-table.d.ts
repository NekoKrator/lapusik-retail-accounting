import "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface TableMeta<TData> {
        onDelete?: (id: string) => Promise<void>;
        isDeleting?: (id: string) => boolean;
    }

    interface ColumnMeta<TData> {
        label?: string;
    }
}
