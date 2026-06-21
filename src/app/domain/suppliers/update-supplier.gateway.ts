import { Observable } from 'rxjs';

import { UpdateSupplier } from './suppliers.entity';
import { UpdateSupplierResponse } from './suppliers.response';

export abstract class UpdateSupplierGateway {
  abstract execute(
    id: number,
    dataSupplier: UpdateSupplier
  ): Observable<UpdateSupplierResponse>;
}
