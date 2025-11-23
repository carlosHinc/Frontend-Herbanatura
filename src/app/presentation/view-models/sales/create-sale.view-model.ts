import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { CreateSaleUseCase } from '@application/use-cases/sales/create-sale.usecase';
import { CreateSale } from '@domain/sales/sales.entity';

@Injectable()
export class CreateSaleViewModel {
  private readonly useCase = inject(CreateSaleUseCase);

  async execute(saleData: CreateSale) {
    return await this.createSale(saleData);
  }

  private async createSale(saleData: CreateSale) {
    return lastValueFrom(this.useCase.execute(saleData));
  }
}
