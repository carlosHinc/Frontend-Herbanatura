export interface HttpBatchData {
  id: number;
  id_product: number;
  batch_name: string;
  expiration_date: string;
  stock: number;
  unit_purchase_price: number;
  total_purchase_price: number;
  entry_date: string;
}

export interface HttpBillData {
  id: number;
  type: string;
  value: number;
  createdAt: string;
}

export interface HttpOrderSummary {
  totalBatches: number;
  totalProducts: number;
  totalValue: number;
}

export interface HttpOrderData {
  bill: HttpBillData;
  batches: HttpBatchData[];
  summary: HttpOrderSummary;
}

export interface HttpCreateOrderResponse {
  success: boolean;
  message: string;
  data: HttpOrderData;
}
