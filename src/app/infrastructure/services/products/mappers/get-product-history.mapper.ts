import { GetProductHistoryResponse } from '@domain/products/product-history.response';
import { HttpProductHistoryData } from '../http-product-history.response';

export class ProductHistoryMapper {
  static fromHttp(data: HttpProductHistoryData): GetProductHistoryResponse {
    return {
      product: {
        id: data.product.id,
        name: data.product.name,
        laboratory: data.product.laboratory,
        stock: Number(data.product.stock),
        salesPrice: data.product.sales_price,
        description: data.product.description || undefined,
      },
      salesHistory: data.salesHistory.map((sale) => ({
        unitPrice: sale.unit_price,
        stock: sale.stock,
        totalPrice: sale.total_price,
        dateSale: sale.date_sale,
      })),
      ordersHistory: data.ordersHistory.map((order) => ({
        unitPrice: order.unit_price,
        amount: order.amount,
        totalPrice: order.total_price,
        dateBill: order.date_bill,
        supplier: order.supplier,
      })),
      expirationDatesHistory: data.expirationDatesHistory.map((exp) => ({
        productId: exp.product_id,
        productName: exp.product_name,
        salesPrice: exp.sales_price,
        laboratory: exp.laboratory,
        batchId: exp.batch_id,
        batchName: exp.batch_name,
        expirationDate: exp.expiration_date,
        stock: exp.stock,
        entryDate: exp.entry_date,
        daysSinceExpiration: exp.days_since_expiration,
        isInInventory: exp.is_in_inventory,
      })),
    };
  }
}
