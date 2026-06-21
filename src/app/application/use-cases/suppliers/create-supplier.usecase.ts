import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateSupplierGateway } from '@domain/suppliers/create-supplier.gateway';
import { CreateSupplier, Supplier } from '@domain/suppliers/suppliers.entity';

@Injectable()
export class CreateSupplierUseCase {
  private readonly gateway = inject(CreateSupplierGateway);

  execute(payload: CreateSupplier): Observable<Supplier> {
    return this.gateway.execute(payload);
  }
}
