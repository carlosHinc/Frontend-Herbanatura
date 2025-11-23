interface Batches {
  idProduct: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  unitPurchasePrice: number;
}

export interface OrderDetails {
  id: number;
  product: string;
  laboratory: string;
  unitPrice: number;
  amount: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  value: number;
  date: string;
}

export interface CreateOrder {
  batches: Batches[];
}
