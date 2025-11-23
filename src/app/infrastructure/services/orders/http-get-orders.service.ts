import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { GetOrdersGateway } from '@domain/orders/get-orders.gateway';
import { GetOrdersResponse } from '@domain/orders/orders.response';
import { map, Observable } from 'rxjs';
import { HttpGetOrdersResponse } from './http-orders.response';
import { environment } from 'src/enviroments/enviroment';
import { GetOrdersMapper } from './mappers/get-orders.mapper';

@Injectable()
export class HttpGetOrdersService implements GetOrdersGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetOrdersResponse> {
    return this.httpClient
      .get<HttpGetOrdersResponse>(`${environment.apiUrl}/orders`)
      .pipe(
        map((response) => ({
          orders: response.data.map(GetOrdersMapper.fromHttp),
        }))
      );
  }
}
