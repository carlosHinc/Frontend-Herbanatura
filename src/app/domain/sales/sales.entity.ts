export interface Sale {
  id: number;
  value: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface ProductDataForSale {
  idProduct: number;
  unitPrice: number;
  stock: number;
}

export interface CreateSale {
  description: string;
  products: ProductDataForSale[];
}
