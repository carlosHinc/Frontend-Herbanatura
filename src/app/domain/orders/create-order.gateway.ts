import { Observable } from 'rxjs';

import { CreateOrder } from './orders.entity';
import { CreateOrderResponse } from './orders.response';

export abstract class CreateOrderGateway {
  abstract execute(orderDate: CreateOrder): Observable<CreateOrderResponse>;
}
