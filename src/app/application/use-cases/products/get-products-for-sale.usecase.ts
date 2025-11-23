import { inject, Injectable } from '@angular/core';

import { GetProductsForSaleGateway } from '@domain/products/get-products-for-sale.gateway';
import { GetProductsResponse } from '@domain/products/products.response';
import { Observable } from 'rxjs';

@Injectable()
export class GetProductsForSaleUseCase {
  private readonly gateway = inject(GetProductsForSaleGateway);

  execute(): Observable<GetProductsResponse> {
    return this.gateway.execute();
  }
}
