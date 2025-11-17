import { Product } from '../../../../domain/products/products.entity';
import { HttpProductData } from '../http-products.response';

export class ProductMapper {
  static fromHttp(httpProductData: HttpProductData): Product {
    return {
      id: httpProductData.id,
      name: httpProductData.name,
      laboratory: httpProductData.laboratory,
      stock: httpProductData.stock,
    };
  }
}
