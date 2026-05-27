import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExpireInventoryBatchesGateway } from '@domain/products/expire-inventory-batches.gateway';
import { ExpireInventoryBatchesResponse } from '@domain/products/products.response';

@Injectable()
export class ExpireInventoryBatchesUseCase {
  private readonly gateway = inject(ExpireInventoryBatchesGateway);

  execute(batchIds: number[]): Observable<ExpireInventoryBatchesResponse> {
    return this.gateway.execute(batchIds);
  }
}
