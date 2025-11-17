import { Observable } from 'rxjs';
import { CreateProductResponse } from './products.response';
import { CreateProduct } from './products.entity';

export abstract class CreateProductGateway {
  abstract execute(
    createProduct: CreateProduct
  ): Observable<CreateProductResponse>;
}
