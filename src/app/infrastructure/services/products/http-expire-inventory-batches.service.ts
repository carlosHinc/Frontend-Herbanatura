import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';
import { ExpireInventoryBatchesGateway } from '@domain/products/expire-inventory-batches.gateway';
import { ExpireInventoryBatchesResponse } from '@domain/products/products.response';
import { HttpExpireInventoryBatchesResponse } from './http-products.response';

@Injectable()
export class HttpExpireInventoryBatchesService implements ExpireInventoryBatchesGateway {
  private readonly httpClient = inject(HttpClient);

  execute(batchIds: number[]): Observable<ExpireInventoryBatchesResponse> {
    return this.httpClient
      .post<HttpExpireInventoryBatchesResponse>(
        `${environment.apiUrl}/products/batches/expire`,
        { batchIds },
      )
      .pipe(
        map((response) => ({
          processedBatches: response.data.processedBatches,
        })),
      );
  }
}
