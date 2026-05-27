import { Observable } from 'rxjs';
import { GetProductsExpiredResponse } from './products.response';

export abstract class GetProductsExpiredGateway {
  abstract execute(): Observable<GetProductsExpiredResponse>;
}
