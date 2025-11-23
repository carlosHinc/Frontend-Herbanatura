import { Observable } from 'rxjs';

import { GetOrderDetailsResponse } from './orders.response';

export abstract class GetOrderDetailsGateway {
  abstract execute(idOrder: number): Observable<GetOrderDetailsResponse>;
}
