import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetProductsExpiringGateway } from '@domain/products/get-products-expiring.gateway';
import { GetProductsExpiringResponse } from '@domain/products/products.response';

@Injectable()
export class GetProductsExpiringUseCase {
  private readonly gateway = inject(GetProductsExpiringGateway);

  execute(daysToExpiration: number): Observable<GetProductsExpiringResponse> {
    return this.gateway.execute(daysToExpiration);
  }
}
