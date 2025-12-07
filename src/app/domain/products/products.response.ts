import { Product, ProductsCloseToExpiring } from './products.entity';

export interface GetProductsResponse {
  products: Product[];
}

export interface CreateProductResponse {
  product: Product;
}

export interface GetProductsExpiringResponse {
  products: ProductsCloseToExpiring[];
}

export interface GetProductResponse {
  product: Product;
}

export interface UpdateProductResponse {
  product: Product;
}
