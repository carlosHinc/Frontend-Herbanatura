import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { GetProductGateway } from '@domain/products/get-product.gateway';
import { GetProductResponse } from '@domain/products/products.response';
import { HttpGetProductResponse } from './http-products.response';
import { ProductMapper } from './mappers/get-products.mapper';

@Injectable()
export class HttpGetProductService implements GetProductGateway {
  private readonly httpClient = inject(HttpClient);

  execute(idProduct: number): Observable<GetProductResponse> {
    return this.httpClient
      .get<HttpGetProductResponse>(
        `${environment.apiUrl}/products/${idProduct}`
      )
      .pipe(
        map((response) => ({
          product: ProductMapper.fromHttpGetProduct(response.data),
        }))
      );
  }
}
