import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductResponse } from '../../../domain/products/products.response';
import { CreateProductGateway } from '../../../domain/products/create-product.gateway';
import { CreateProduct } from '@domain/products/products.entity';

@Injectable()
export class CreateProductUseCase {
  private readonly gateway = inject(CreateProductGateway);

  execute(createProduct: CreateProduct): Observable<CreateProductResponse> {
    return this.gateway.execute(createProduct);
  }
}
