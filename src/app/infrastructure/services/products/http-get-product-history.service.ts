import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { GetProductHistoryGateway } from '@domain/products/get-product-history.gateway';
import { GetProductHistoryResponse } from '@domain/products/product-history.response';
import { HttpGetProductHistoryResponse } from './http-product-history.response';
import { ProductHistoryMapper } from './mappers/get-product-history.mapper';

@Injectable()
export class HttpGetProductHistoryService implements GetProductHistoryGateway {
  private readonly httpClient = inject(HttpClient);

  execute(idProduct: number): Observable<GetProductHistoryResponse> {
    return this.httpClient
      .get<HttpGetProductHistoryResponse>(
        `${environment.apiUrl}/products/history/${idProduct}`
      )
      .pipe(map((response) => ProductHistoryMapper.fromHttp(response.data)));
  }
}
