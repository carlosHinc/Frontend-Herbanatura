import { Observable } from 'rxjs';

import { GetProductHistoryResponse } from './product-history.response';

export abstract class GetProductHistoryGateway {
  abstract execute(idProduct: number): Observable<GetProductHistoryResponse>;
}
