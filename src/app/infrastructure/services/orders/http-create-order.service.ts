import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';
import { CreateOrderGateway } from '@domain/orders/create-order.gateway';
import { CreateOrder } from '@domain/orders/orders.entity';
import { HttpCreateOrderResponse } from './http-orders.response';
import { CreateOrderResponse } from '@domain/orders/orders.response';
import { CreateOrderMapper } from './mappers/create-order.mapper';

@Injectable()
export class HttpCreateOrderService implements CreateOrderGateway {
  private readonly httpClient = inject(HttpClient);

  execute(orderData: CreateOrder): Observable<CreateOrderResponse> {
    return this.httpClient
      .post<HttpCreateOrderResponse>(`${environment.apiUrl}/orders`, orderData)
      .pipe(
        map((response) => ({
          bill: CreateOrderMapper.fromHttp(response.data.bill),
        }))
      );
  }
}
