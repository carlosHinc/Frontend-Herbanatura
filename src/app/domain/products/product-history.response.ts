import { Product } from './products.entity';
import {
  ProductExpirationDatesHistory,
  ProductOrdersHistory,
  ProductSalesHistory,
} from './product-history.entity';

export interface GetProductHistoryResponse {
  product: Product;
  salesHistory: ProductSalesHistory[];
  ordersHistory: ProductOrdersHistory[];
  expirationDatesHistory: ProductExpirationDatesHistory[];
}
