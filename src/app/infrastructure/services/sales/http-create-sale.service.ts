import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../enviroments/enviroment';
import { HttpCreateSaleResponse } from './http-sales.response';
import { CreateSaleGateway } from '@domain/sales/create-sale.gateway';
import { CreateSale } from '@domain/sales/sales.entity';
import { CreateSaleResponse } from '@domain/sales/sales.response';
import { SaleMapper } from './mappers/sale.mapper';

@Injectable()
export class HttpCreateSaleService implements CreateSaleGateway {
  private readonly httpClient = inject(HttpClient);

  execute(orderDate: CreateSale): Observable<CreateSaleResponse> {
    return this.httpClient
      .post<HttpCreateSaleResponse>(`${environment.apiUrl}/sales`, orderDate)
      .pipe(
        map((response) => ({ sale: SaleMapper.fromHttp(response.data.sale) }))
      );
  }
}
