import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetProductHistoryGateway } from '@domain/products/get-product-history.gateway';
import { GetProductHistoryResponse } from '@domain/products/product-history.response';

@Injectable()
export class GetProductHistoryUseCase {
  private readonly gateway = inject(GetProductHistoryGateway);

  execute(idProduct: number): Observable<GetProductHistoryResponse> {
    return this.gateway.execute(idProduct);
  }
}
