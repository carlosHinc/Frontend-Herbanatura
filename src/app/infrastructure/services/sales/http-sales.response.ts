export interface HttpSale {
  id: number;
  value: number;
  date: string;
  description: string;
}

export interface HttSaleDetail {
  id: number;
  id_sale: number;
  id_product: number;
  product_name: string;
  laboratory: string;
  unit_price: number;
  stock: number;
  total_price: number;
}

interface HttSummary {
  totalProducts: number;
  totalItems: number;
  totalValue: number;
}

interface HttDataResponse {
  sale: HttpSale;
  details: HttSaleDetail[];
  summary: HttSummary;
}

export interface HttpCreateSaleResponse {
  success: boolean;
  message: string;
  data: HttDataResponse;
}

export interface HttpGetSalesResponse {
  data: HttpSale[];
}

export interface HttpGetSaleDetailsResponse {
  data: {
    sale: HttpSale;
    details: HttSaleDetail[];
  };
}
