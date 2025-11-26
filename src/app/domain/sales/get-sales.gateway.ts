import { Observable } from 'rxjs';

import { GetSalesResponse } from './sales.response';

export abstract class GetSalesGateway {
  abstract execute(): Observable<GetSalesResponse>;
}
