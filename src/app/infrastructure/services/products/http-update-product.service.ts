import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UpdateProduct } from '@domain/products/products.entity';
import { UpdateProductGateway } from '@domain/products/update-product.gateway';
import { UpdateProductResponse } from '@domain/products/products.response';
import { HttpUpdateProductResponse } from './http-products.response';
import { environment } from 'src/enviroments/enviroment';
import { ProductMapper } from './mappers/get-products.mapper';

@Injectable()
export class HttpUpdateProductService implements UpdateProductGateway {
  private readonly httpClient = inject(HttpClient);

  execute(
    idProduct: number,
    dataProduct: UpdateProduct
  ): Observable<UpdateProductResponse> {
    return this.httpClient
      .put<HttpUpdateProductResponse>(
        `${environment.apiUrl}/products/${idProduct}`,
        dataProduct
      )
      .pipe(
        map((response) => ({ product: ProductMapper.fromHttp(response.data) }))
      );
  }
}
