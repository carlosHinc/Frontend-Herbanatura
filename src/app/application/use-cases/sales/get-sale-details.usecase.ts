import { inject, Injectable } from '@angular/core';
import { GetSaleDetailsGateway } from '@domain/sales/get-sale-details.gateway';
import { GetSaleDetailsResponse } from '@domain/sales/sales.response';
import { Observable } from 'rxjs';

@Injectable()
export class GetSaleDetailsUseCase {
  private readonly gateway = inject(GetSaleDetailsGateway);

  execute(idSale: number): Observable<GetSaleDetailsResponse> {
    return this.gateway.execute(idSale);
  }
}
