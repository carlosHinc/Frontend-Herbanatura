import { Sale, SaleDetail } from './sales.entity';

export interface CreateSaleResponse {
  sale: Sale;
}

export interface GetSalesResponse {
  sales: Sale[];
}

export interface GetSaleDetailsResponse {
  saleDetails: {
    sale: Sale;
    details: SaleDetail[];
  };
}
