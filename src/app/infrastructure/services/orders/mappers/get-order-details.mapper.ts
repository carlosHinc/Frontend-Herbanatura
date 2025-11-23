import { OrderDetails } from '@domain/orders/orders.entity';
import { HttpDataOrderDetails } from '../http-orders.response';

export class GetOrderDetailsMapper {
  static fromHttp(detail: HttpDataOrderDetails): OrderDetails {
    return {
      id: detail.id,
      product: detail.product_name,
      laboratory: detail.laboratory,
      unitPrice: detail.unit_price,
      amount: detail.amount,
      totalPrice: detail.total_price,
    };
  }
}
