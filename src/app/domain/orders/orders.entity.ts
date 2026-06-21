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
  supplier: string;
}

export interface ProductBatch {
  id: number;
  idProduct: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  unitPurchasePrice: number;
  totalPurchasePrice: number;
  entryDate: string;
}

export interface OrderSummary {
  totalBatches: number;
  totalProducts: number;
  totalValue: number;
}

export interface CreateOrder {
  idSupplier: number;
  batches: Batches[];
}
