export interface HttpProductData {
  id: number;
  name: string;
  laboratory: string;
  stock: number;
}

export interface HttpGetProductsResponse {
  data: HttpProductData[];
}

export interface HttpCreateProductResponse {
  data: HttpProductData;
}
