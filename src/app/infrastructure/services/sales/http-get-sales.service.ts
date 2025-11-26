import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { GetSalesGateway } from '@domain/sales/get-sales.gateway';
import { GetSalesResponse } from '@domain/sales/sales.response';
import { SaleMapper } from './mappers/sale.mapper';
import { HttpGetSalesResponse } from './http-sales.response';

@Injectable()
export class HttpGetSalesService implements GetSalesGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetSalesResponse> {
    return this.httpClient
      .get<HttpGetSalesResponse>(`${environment.apiUrl}/sales`)
      .pipe(
        map((response) => ({
          sales: response.data.map(SaleMapper.fromHttp),
        }))
      );
  }
}
