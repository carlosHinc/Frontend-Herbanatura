import { Observable } from 'rxjs';
import { GetProductsResponse } from './products.response';

export abstract class GetProductsForSaleGateway {
  abstract execute(): Observable<GetProductsResponse>;
}
