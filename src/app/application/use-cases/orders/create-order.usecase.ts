import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateOrderGateway } from '@domain/orders/create-order.gateway';
import { CreateOrderResponse } from '@domain/orders/orders.response';
import { CreateOrder } from '@domain/orders/orders.entity';

@Injectable()
export class CreateOrderUseCase {
  private readonly gateway = inject(CreateOrderGateway);

  execute(orderData: CreateOrder): Observable<CreateOrderResponse> {
    return this.gateway.execute(orderData);
  }
}
