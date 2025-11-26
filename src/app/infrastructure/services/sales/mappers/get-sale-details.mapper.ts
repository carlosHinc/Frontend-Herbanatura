import { HttSaleDetail } from '../http-sales.response';
import { SaleDetail } from '@domain/sales/sales.entity';

export class GetSaleDetailsMapper {
  static fromHttp(detail: HttSaleDetail): SaleDetail {
    return {
      id: detail.id,
      idSale: detail.id_sale,
      idProduct: detail.id_product,
      productName: detail.product_name,
      laboratory: detail.laboratory,
      unitPrice: detail.unit_price,
      stock: detail.stock,
      totalPrice: detail.total_price,
    };
  }
}
