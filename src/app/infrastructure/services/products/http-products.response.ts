interface HttpBatchExpiring {
  batchId: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  entryDate: string;
  daysToExpire: number;
}

export interface HttpDataProductExpiring {
  productId: number;
  productName: string;
  laboratory: string;
  salesPrice: number;
  totalStock: number;
  batches: HttpBatchExpiring[];
}

export interface HttpProductData {
  id: number;
  name: string;
  laboratory: string;
  stock: number;
  sales_price: number;
  id_laboratory?: number;
  description?: string;
}

export interface HttpGetProductsResponse {
  data: HttpProductData[];
}

export interface HttpCreateProductResponse {
  data: HttpProductData;
}

export interface HttpUpdateProductResponse {
  data: HttpProductData;
}

export interface HttpUpdateProductResponse {
  data: HttpProductData;
}

export interface HttpGetProductsExpiringResponse {
  data: HttpDataProductExpiring[];
}

export interface HttpGetProductResponse {
  data: HttpProductData;
}
