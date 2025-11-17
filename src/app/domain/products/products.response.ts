import { Product } from './products.entity';

export interface GetProductsResponse {
  products: Product[];
}

export interface CreateProductResponse {
  product: Product;
}
