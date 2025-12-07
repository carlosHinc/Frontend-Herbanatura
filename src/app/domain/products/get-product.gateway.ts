import { Observable } from 'rxjs';

import { GetProductResponse } from './products.response';

export abstract class GetProductGateway {
  abstract execute(idProduct: number): Observable<GetProductResponse>;
}
