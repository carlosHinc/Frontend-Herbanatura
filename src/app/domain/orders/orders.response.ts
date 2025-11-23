import { Order, OrderDetails } from './orders.entity';

export interface Bill {
  id: number;
  type: string;
  value: number;
  createdAt: string;
}

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
  bill: Bill;
}
