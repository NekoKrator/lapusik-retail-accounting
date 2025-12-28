export type SupplierListItem = {
  id: string;
  name: string;
};

export type SupplierUpdateResult = {
  id: string;
  name?: string;
  updatedAt?: Date;
};
