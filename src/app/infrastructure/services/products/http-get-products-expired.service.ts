import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { ProductMapper } from './mappers/get-products.mapper';
import { GetProductsExpiredResponse } from '@domain/products/products.response';
import { HttpGetProductsExpiredResponse } from './http-products.response';
import { GetProductsExpiredGateway } from '@domain/products/get-products-expired.gateway';

@Injectable()
export class HttpGetProductsExpiredService implements GetProductsExpiredGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetProductsExpiredResponse> {
    return this.httpClient
      .get<HttpGetProductsExpiredResponse>(
        `${environment.apiUrl}/products/expired`,
      )
      .pipe(
        map((response) => ({
          products: response.data.products.map(ProductMapper.fromHttpExpired),
        })),
      );
  }
}
