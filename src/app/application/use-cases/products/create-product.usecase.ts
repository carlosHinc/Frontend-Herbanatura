import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductResponse } from '../../../domain/products/products.response';
import { CreateProductGateway } from '../../../domain/products/create-product.gateway';

@Injectable()
export class CreateProductUseCase {
  private readonly gateway = inject(CreateProductGateway);

  execute(): Observable<CreateProductResponse> {
    return this.gateway.execute();
  }
}
