export interface Sale {
  id: number;
  value: number;
  date: string;
  description: string;
}

export interface SaleDetail {
  id: number;
  idSale: number;
  idProduct: number;
  productName: string;
  laboratory: string;
  unitPrice: number;
  stock: number;
  totalPrice: number;
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
