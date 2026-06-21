import { Order } from '@domain/orders/orders.entity';
import { HttpDataOrder } from '../http-orders.response';

export class GetOrdersMapper {
  static fromHttp(order: HttpDataOrder): Order {
    return {
      id: order.id,
      value: order.value,
      date: order.created_at,
      supplier: order.supplier ?? '',
    };
  }
}
