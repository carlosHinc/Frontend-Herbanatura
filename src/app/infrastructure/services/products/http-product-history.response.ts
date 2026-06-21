export interface HttpProductHistoryData {
  product: {
    id: number;
    name: string;
    laboratory: string;
    description: string;
    sales_price: number;
    stock: number;
  };
  salesHistory: {
    unit_price: number;
    stock: number;
    total_price: number;
    date_sale: string;
  }[];
  ordersHistory: {
    unit_price: number;
    amount: number;
    total_price: number;
    date_bill: string;
    supplier: string;
  }[];
  expirationDatesHistory: {
    product_id: number;
    product_name: string;
    sales_price: number;
    laboratory: string;
    batch_id: number;
    batch_name: string;
    expiration_date: string;
    stock: number;
    entry_date: string;
    days_since_expiration: number;
    is_in_inventory: boolean;
  }[];
}

export interface HttpGetProductHistoryResponse {
  data: HttpProductHistoryData;
}
