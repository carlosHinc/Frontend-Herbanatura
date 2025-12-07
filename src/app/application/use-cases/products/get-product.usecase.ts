import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetProductGateway } from '@domain/products/get-product.gateway';
import { GetProductResponse } from '@domain/products/products.response';

@Injectable()
export class GetProductUseCase {
  private readonly gateway = inject(GetProductGateway);

  execute(idProduct: number): Observable<GetProductResponse> {
    return this.gateway.execute(idProduct);
  }
}
