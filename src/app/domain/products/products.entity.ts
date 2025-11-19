export interface Product {
  id: number;
  name: string;
  laboratory: string;
  stock: number;
}

export interface CreateProduct {
  name: string;
  idLaboratory: number;
  description?: string;
  batchNumber?: string;
  expirationDate?: string;
  stock?: number;
  unitPurchasePrice?: number;
}
