import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetProductsExpiredGateway } from '@domain/products/get-products-expired.gateway';
import { GetProductsExpiredResponse } from '@domain/products/products.response';

@Injectable()
export class GetProductsExpiredUseCase {
  private readonly gateway = inject(GetProductsExpiredGateway);

  execute(): Observable<GetProductsExpiredResponse> {
    return this.gateway.execute();
  }
}
