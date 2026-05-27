import { Observable } from 'rxjs';
import { ExpireInventoryBatchesResponse } from './products.response';

export abstract class ExpireInventoryBatchesGateway {
  abstract execute(
    batchIds: number[],
  ): Observable<ExpireInventoryBatchesResponse>;
}
