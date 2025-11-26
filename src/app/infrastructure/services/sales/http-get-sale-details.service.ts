import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { GetSaleDetailsGateway } from '@domain/sales/get-sale-details.gateway';
import { GetSaleDetailsResponse } from '@domain/sales/sales.response';
import { HttpGetSaleDetailsResponse } from './http-sales.response';
import { SaleMapper } from './mappers/sale.mapper';
import { GetSaleDetailsMapper } from './mappers/get-sale-details.mapper';

@Injectable()
export class HttpGetSaleDetailsService implements GetSaleDetailsGateway {
  private readonly httpClient = inject(HttpClient);

  execute(idSale: number): Observable<GetSaleDetailsResponse> {
    return this.httpClient
      .get<HttpGetSaleDetailsResponse>(`${environment.apiUrl}/sales/${idSale}`)
      .pipe(
        map((response) => ({
          saleDetails: {
            sale: SaleMapper.fromHttp(response.data.sale),
            details: response.data.details.map(GetSaleDetailsMapper.fromHttp),
          },
        }))
      );
  }
}
