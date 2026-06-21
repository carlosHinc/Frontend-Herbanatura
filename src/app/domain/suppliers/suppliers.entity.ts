export interface Supplier {
  id: number;
  name: string;
  cellphone?: string | null;
  address?: string | null;
  comments?: string | null;
}

export type CreateSupplier = Partial<Supplier>;

export interface UpdateSupplier {
  name?: string | null;
  cellphone?: string | null;
  address?: string | null;
  comments?: string | null;
}
