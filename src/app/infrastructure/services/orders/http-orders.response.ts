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

export interface HttpDataOrder {
  id: number;
  value: number;
  created_at: string;
}

export interface HttpDataOrderDetails {
  id: number;
  product_name: string;
  laboratory: string;
  unit_price: number;
  amount: number;
  total_price: number;
}

export interface HttpGetOrdersResponse {
  data: HttpDataOrder[];
}

export interface HttpGetOrderDetailsResponse {
  data: {
    bill: HttpDataOrder;
    details: HttpDataOrderDetails[];
  };
}
