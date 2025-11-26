import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetSalesGateway } from '@domain/sales/get-sales.gateway';
import { GetSalesResponse } from '@domain/sales/sales.response';

@Injectable()
export class GetSalesUseCase {
  private readonly gateway = inject(GetSalesGateway);

  execute(): Observable<GetSalesResponse> {
    return this.gateway.execute();
  }
}
