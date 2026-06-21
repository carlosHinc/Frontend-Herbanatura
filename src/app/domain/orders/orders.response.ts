import {
  Order,
  OrderDetails,
  OrderSummary,
  ProductBatch,
} from './orders.entity';

export interface GetOrdersResponse {
  orders: Order[];
}

export interface GetOrderDetailsResponse {
  orderDetails: {
    order: Order;
    details: OrderDetails[];
  };
}

export interface CreateOrderResponse {
  order: Order;
  details: OrderDetails[];
  batches: ProductBatch[];
  summary: OrderSummary;
}
