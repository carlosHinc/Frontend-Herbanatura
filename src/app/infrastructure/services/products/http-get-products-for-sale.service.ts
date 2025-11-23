import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { ProductMapper } from './mappers/get-products.mapper';
import { GetProductsForSaleGateway } from '@domain/products/get-products-for-sale.gateway';
import { GetProductsResponse } from '@domain/products/products.response';
import { HttpGetProductsResponse } from './http-products.response';

@Injectable()
export class HttpGetProductsForSaleService
  implements GetProductsForSaleGateway
{
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetProductsResponse> {
    return this.httpClient
      .get<HttpGetProductsResponse>(`${environment.apiUrl}/products/for-sale`)
      .pipe(
        map((response) => ({
          products: response.data.map(ProductMapper.fromHttp),
        }))
      );
  }
}
