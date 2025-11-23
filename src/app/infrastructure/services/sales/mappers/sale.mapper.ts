import { Sale } from '@domain/sales/sales.entity';
import { HttpSale } from '../http-sales.response';

export class SaleMapper {
  static fromHttp(httpSaleData: HttpSale): Sale {
    return {
      id: httpSaleData.id,
      value: httpSaleData.value,
      date: httpSaleData.date,
      description: httpSaleData.description,
      createdAt: httpSaleData.createdAt,
    };
  }
}
