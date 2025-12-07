export interface Product {
  id: number;
  name: string;
  laboratory: string;
  stock: number;
  salesPrice: number;
  idLaboratory?: number;
  description?: string;
}

export interface CreateProduct {
  name: string;
  idLaboratory: number;
  salesPrice: number;
  description?: string;
  batchNumber?: string;
  expirationDate?: string;
  stock?: number;
  unitPurchasePrice?: number;
}

export interface UpdateProduct {
  idLaboratory?: number;
  name?: string;
  description?: string;
  salesPrice?: number;
}

export interface InventoryProductsCloseToExpiring {
  purchaseDate: string;
  expirationDate: string;
  stock: number;
  daysToExpire: number;
}

export interface ProductsCloseToExpiring {
  product: Product;
  inventory: InventoryProductsCloseToExpiring[];
}
