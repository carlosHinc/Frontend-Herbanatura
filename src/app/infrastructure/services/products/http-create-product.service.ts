import { inject, Injectable } from '@angular/core';
import { CreateProductGateway } from '../../../domain/products/create-product.gateway';
import { map, Observable } from 'rxjs';
import { CreateProductResponse } from '../../../domain/products/products.response';
import { HttpClient } from '@angular/common/http';
import { HttpCreateProductResponse } from './http-products.response';
import { environment } from '../../../../enviroments/enviroment';
import { CreateProduct } from '../../../domain/products/products.entity';
import { ProductMapper } from './mappers/get-products.mapper';

@Injectable()
export class HttpCreateProductService implements CreateProductGateway {
  private readonly httpClient = inject(HttpClient);

  execute(createProduct: CreateProduct): Observable<CreateProductResponse> {
    return this.httpClient
      .post<HttpCreateProductResponse>(
        `${environment.apiUrl}/products`,
        createProduct
      )
      .pipe(
        map((response) => ({ product: ProductMapper.fromHttp(response.data) }))
      );
  }
}
