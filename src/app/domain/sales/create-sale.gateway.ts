import { Observable } from 'rxjs';

import { CreateSale } from './sales.entity';
import { CreateSaleResponse } from './sales.response';

export abstract class CreateSaleGateway {
  abstract execute(saleData: CreateSale): Observable<CreateSaleResponse>;
}
