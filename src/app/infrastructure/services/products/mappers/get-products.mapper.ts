import {
  Product,
  ProductsCloseToExpiring,
} from '../../../../domain/products/products.entity';
import {
  HttpDataProductExpiring,
  HttpProductData,
} from '../http-products.response';

export class ProductMapper {
  static fromHttp(httpProductData: HttpProductData): Product {
    return {
      id: httpProductData.id,
      name: httpProductData.name,
      laboratory: httpProductData.laboratory,
      stock: httpProductData.stock,
      salesPrice: httpProductData.sales_price,
      description: httpProductData.description || undefined,
    };
  }

  static fromHttpExpiring(
    httpData: HttpDataProductExpiring
  ): ProductsCloseToExpiring {
    return {
      product: {
        id: httpData.productId,
        name: httpData.productName,
        laboratory: httpData.laboratory,
        stock: httpData.totalStock,
        salesPrice: httpData.salesPrice,
      },
      inventory: httpData.batches.map((batch) => ({
        purchaseDate: batch.entryDate,
        expirationDate: batch.expirationDate,
        stock: batch.stock,
        daysToExpire: batch.daysToExpire,
      })),
    };
  }

  static fromHttpGetProduct(httpProductData: HttpProductData): Product {
    console.log('fromHttpGetProduct httpProductData', httpProductData);
    return {
      id: httpProductData.id,
      name: httpProductData.name,
      laboratory: httpProductData.laboratory,
      stock: httpProductData.stock,
      salesPrice: httpProductData.sales_price,
      idLaboratory: httpProductData.id_laboratory,
      description: httpProductData.description,
    };
  }
}
