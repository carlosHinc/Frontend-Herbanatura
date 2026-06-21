import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { UpdateSupplierUseCase } from '@application/use-cases/suppliers/update-supplier.usecase';
import { UpdateSupplier } from '@domain/suppliers/suppliers.entity';

@Injectable()
export class UpdateSupplierViewModel {
  private readonly useCase = inject(UpdateSupplierUseCase);

  async execute(id: number, supplierData: UpdateSupplier) {
    return await this.updateSupplier(id, supplierData);
  }

  private async updateSupplier(id: number, supplierData: UpdateSupplier) {
    return lastValueFrom(this.useCase.execute(id, supplierData));
  }
}
