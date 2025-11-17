import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetProductsResponse } from '../../../domain/products/products.response';
import { GetProductsGateway } from '../../../domain/products/get-products.gateway';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';
import { HttpGetProductsResponse } from './http-products.response';
import { ProductMapper } from './mappers/get-products.mapper';

@Injectable()
export class HttpGetProductsService implements GetProductsGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetProductsResponse> {
    return this.httpClient
      .get<HttpGetProductsResponse>(`${environment.apiUrl}/products`)
      .pipe(
        map((response) => ({
          products: response.data.map(ProductMapper.fromHttp),
        }))
      );
  }
}
