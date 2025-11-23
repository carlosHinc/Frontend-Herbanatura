import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetOrderDetailsGateway } from '@domain/orders/get-order-details.gateway';
import { GetOrderDetailsResponse } from '@domain/orders/orders.response';

@Injectable()
export class GetOrderDetailsUseCase {
  private readonly gateway = inject(GetOrderDetailsGateway);

  execute(idOrder: number): Observable<GetOrderDetailsResponse> {
    return this.gateway.execute(idOrder);
  }
}
