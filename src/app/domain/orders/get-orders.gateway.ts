import { Observable } from 'rxjs';

import { GetOrdersResponse } from './orders.response';

export abstract class GetOrdersGateway {
  abstract execute(): Observable<GetOrdersResponse>;
}
