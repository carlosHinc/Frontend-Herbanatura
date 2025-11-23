export interface HttpSale {
  id: number;
  value: number;
  date: string;
  description: string;
  createdAt: string;
}

interface HttSaleDetail {
  id: number;
  id_sale: number;
  id_product: number;
  unit_value: number;
  stock: number;
  unit_total: number;
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
