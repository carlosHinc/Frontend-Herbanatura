import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateSaleGateway } from '@domain/sales/create-sale.gateway';
import { CreateSale } from '@domain/sales/sales.entity';
import { CreateSaleResponse } from '@domain/sales/sales.response';

@Injectable()
export class CreateSaleUseCase {
  private readonly gateway = inject(CreateSaleGateway);

  execute(saleData: CreateSale): Observable<CreateSaleResponse> {
    return this.gateway.execute(saleData);
  }
}
