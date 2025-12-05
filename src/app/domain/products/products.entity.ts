export interface Product {
  id: number;
  name: string;
  laboratory: string;
  stock: number;
  salesPrice: number;
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
