import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { ProductMapper } from './mappers/get-products.mapper';
import { GetProductsExpiringResponse } from '@domain/products/products.response';
import { HttpGetProductsExpiringResponse } from './http-products.response';
import { GetProductsExpiringGateway } from '@domain/products/get-products-expiring.gateway';

@Injectable()
export class HttpGetProductsExpiringService
  implements GetProductsExpiringGateway
{
  private readonly httpClient = inject(HttpClient);

  execute(daysToExpiration: number): Observable<GetProductsExpiringResponse> {
    const params = new HttpParams().set('days', daysToExpiration.toString());

    return this.httpClient
      .get<HttpGetProductsExpiringResponse>(
        `${environment.apiUrl}/products/expiring`,
        { params }
      )
      .pipe(
        map((response) => ({
          products: response.data.map(ProductMapper.fromHttpExpiring),
        }))
      );
  }
}
