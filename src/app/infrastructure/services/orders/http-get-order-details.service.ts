import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { GetOrderDetailsResponse } from '@domain/orders/orders.response';
import { map, Observable } from 'rxjs';
import { HttpGetOrderDetailsResponse } from './http-orders.response';
import { environment } from 'src/enviroments/enviroment';
import { GetOrdersMapper } from './mappers/get-orders.mapper';
import { GetOrderDetailsGateway } from '@domain/orders/get-order-details.gateway';
import { GetOrderDetailsMapper } from './mappers/get-order-details.mapper';

@Injectable()
export class HttpGetOrderDetailsService implements GetOrderDetailsGateway {
  private readonly httpClient = inject(HttpClient);

  execute(idOrder: number): Observable<GetOrderDetailsResponse> {
    return this.httpClient
      .get<HttpGetOrderDetailsResponse>(
        `${environment.apiUrl}/orders/${idOrder}`
      )
      .pipe(
        map((response) => ({
          orderDetails: {
            order: GetOrdersMapper.fromHttp(response.data.bill),
            details: response.data.details.map(GetOrderDetailsMapper.fromHttp),
          },
        }))
      );
  }
}
