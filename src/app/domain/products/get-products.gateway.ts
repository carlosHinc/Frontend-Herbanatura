import { Observable } from 'rxjs';
import { GetProductsResponse } from './products.response';

export abstract class GetProductsGateway {
  abstract execute(): Observable<GetProductsResponse>;
}
