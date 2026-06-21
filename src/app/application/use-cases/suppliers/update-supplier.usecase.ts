import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateSupplier } from '@domain/suppliers/suppliers.entity';
import { UpdateSupplierGateway } from '@domain/suppliers/update-supplier.gateway';
import { UpdateSupplierResponse } from '@domain/suppliers/suppliers.response';

@Injectable()
export class UpdateSupplierUseCase {
  private readonly gateway = inject(UpdateSupplierGateway);

  execute(
    id: number,
    dataSupplier: UpdateSupplier
  ): Observable<UpdateSupplierResponse> {
    return this.gateway.execute(id, dataSupplier);
  }
}
