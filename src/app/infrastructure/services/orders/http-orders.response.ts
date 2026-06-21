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

export interface HttpOrderDetail {
  id: number;
  id_bill: number;
  id_product: number;
  unit_price: number;
  amount: number;
  total_price: number;
  product_name?: string;
  laboratory?: string;
}

export interface HttpOrderSummary {
  totalBatches: number;
  totalProducts: number;
  totalValue: number;
}

export interface HttpCreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: HttpDataOrder & {
      id_supplier: number;
      type: string;
      updated_at: string;
      supplier?: string;
    };
    details: HttpOrderDetail[];
    batches: HttpBatchData[];
    summary: HttpOrderSummary;
  };
}

export interface HttpDataOrder {
  id: number;
  value: number;
  created_at: string;
  supplier?: string;
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
  data: {
    orders: HttpDataOrder[];
  };
}

export interface HttpGetOrderDetailsResponse {
  data: {
    order: HttpDataOrder;
    details: HttpDataOrderDetails[];
  };
}
