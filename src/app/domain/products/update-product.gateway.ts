import { Observable } from 'rxjs';

import { UpdateProduct } from './products.entity';
import { UpdateProductResponse } from './products.response';

export abstract class UpdateProductGateway {
  abstract execute(
    idProduct: number,
    dataProduct: UpdateProduct
  ): Observable<UpdateProductResponse>;
}
