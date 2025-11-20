import { Bill } from '@domain/orders/orders.response';
import { HttpBillData } from '../http-orders.response';

export class CreateOrderMapper {
  static fromHttp(billData: HttpBillData): Bill {
    return {
      id: billData.id,
      type: billData.type,
      value: billData.value,
      createdAt: billData.createdAt,
    };
  }
}
