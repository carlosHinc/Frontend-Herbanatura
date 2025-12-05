import { Observable } from 'rxjs';
import { GetProductsExpiringResponse } from './products.response';

export abstract class GetProductsExpiringGateway {
  abstract execute(
    daysToExpiration: number
  ): Observable<GetProductsExpiringResponse>;
}
