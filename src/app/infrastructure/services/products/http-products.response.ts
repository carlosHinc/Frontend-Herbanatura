interface HttpBatchExpiring {
  batchId: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  entryDate: string;
  daysToExpire: number;
  isInInventory: boolean;
}

export interface HttpDataProductExpiring {
  productId: number;
  productName: string;
  laboratory: string;
  salesPrice: number;
  totalStock: number;
  batches: HttpBatchExpiring[];
}

interface HttpBatchExpired {
  batchId: number;
  batchName: string;
  expirationDate: string;
  stock: number;
  entryDate: string;
  daysSinceExpiration: number;
  isInInventory: boolean;
}

export interface HttpDataProductExpired {
  productId: number;
  productName: string;
  laboratory: string;
  salesPrice: number;
  totalStock: number;
  batches: HttpBatchExpired[];
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
  data: { products: HttpProductData[] };
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
  data: { products: HttpDataProductExpiring[] };
}

export interface HttpGetProductsExpiredResponse {
  data: { products: HttpDataProductExpired[] };
}

export interface HttpGetProductResponse {
  data: HttpProductData;
}

export interface HttpExpireInventoryBatchesResponse {
  data: { processedBatches: number };
}
