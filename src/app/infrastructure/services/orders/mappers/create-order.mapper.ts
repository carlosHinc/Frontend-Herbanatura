import {
  Order,
  OrderDetails,
  ProductBatch,
} from '@domain/orders/orders.entity';
import { CreateOrderResponse } from '@domain/orders/orders.response';
import {
  HttpBatchData,
  HttpCreateOrderResponse,
  HttpOrderDetail,
} from '../http-orders.response';

export class CreateOrderMapper {
  static fromHttp(
    response: HttpCreateOrderResponse['data'],
  ): CreateOrderResponse {
    return {
      order: this.mapOrder(response.order),
      details: response.details.map(this.mapDetail),
      batches: response.batches.map(this.mapBatch),
      summary: response.summary,
    };
  }

  private static mapOrder(
    order: HttpCreateOrderResponse['data']['order'],
  ): Order {
    return {
      id: order.id,
      value: order.value,
      date: order.created_at,
      supplier: order.supplier ?? '',
    };
  }

  private static mapDetail(detail: HttpOrderDetail): OrderDetails {
    return {
      id: detail.id,
      product: detail.product_name ?? '',
      laboratory: detail.laboratory ?? '',
      unitPrice: detail.unit_price,
      amount: detail.amount,
      totalPrice: detail.total_price,
    };
  }

  private static mapBatch(batch: HttpBatchData): ProductBatch {
    return {
      id: batch.id,
      idProduct: batch.id_product,
      batchName: batch.batch_name,
      expirationDate: batch.expiration_date,
      stock: batch.stock,
      unitPurchasePrice: batch.unit_purchase_price,
      totalPurchasePrice: batch.total_purchase_price,
      entryDate: batch.entry_date,
    };
  }
}
