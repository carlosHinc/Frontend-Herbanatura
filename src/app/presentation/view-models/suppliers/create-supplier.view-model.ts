import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { CreateSupplierUseCase } from '@application/use-cases/suppliers/create-supplier.usecase';
import { CreateSupplier } from '@domain/suppliers/suppliers.entity';

@Injectable()
export class CreateSupplierViewModel {
  private readonly useCase = inject(CreateSupplierUseCase);

  async execute(payload: CreateSupplier) {
    return await lastValueFrom(this.useCase.execute(payload));
  }
}
