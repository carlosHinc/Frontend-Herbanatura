export interface ProductSalesHistory {
  unitPrice: number;
  stock: number;
  totalPrice: number;
  dateSale: string;
}

export interface ProductOrdersHistory {
  unitPrice: number;
  amount: number;
  totalPrice: number;
  dateBill: string;
  supplier: string;
}

export interface ProductExpirationDatesHistory {
  productId: number;
  productName: string;
  salesPrice: number;
  laboratory: string;
  batchId: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  entryDate: string;
  daysSinceExpiration: number;
  isInInventory: boolean;
}
