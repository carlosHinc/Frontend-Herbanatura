interface Batches {
  idProduct: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  unitPurchasePrice: number;
}

export interface CreateOrder {
  batches: Batches[];
}
