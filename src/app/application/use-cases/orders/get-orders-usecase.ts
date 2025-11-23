import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetOrdersGateway } from '@domain/orders/get-orders.gateway';
import { GetOrdersResponse } from '@domain/orders/orders.response';

@Injectable()
export class GetOrdersUseCase {
  private readonly gateway = inject(GetOrdersGateway);

  execute(): Observable<GetOrdersResponse> {
    return this.gateway.execute();
  }
}
