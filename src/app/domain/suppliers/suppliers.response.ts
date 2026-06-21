import { Supplier } from './suppliers.entity';

export interface GetSuppliersResponse {
  suppliers: Supplier[];
  count?: number;
}

export interface GetSupplierResponse {
  supplier: Supplier;
}

export interface CreateSupplierResponse {
  supplier: Supplier;
}

export interface UpdateSupplierResponse {
  supplier: Supplier;
}
