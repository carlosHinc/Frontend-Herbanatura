import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetSuppliersGateway } from '@domain/suppliers/get-suppliers.gateway';
import { GetSuppliersResponse } from '@domain/suppliers/suppliers.response';

@Injectable()
export class GetSuppliersUseCase {
  private readonly gateway = inject(GetSuppliersGateway);

  execute(): Observable<GetSuppliersResponse> {
    return this.gateway.execute();
  }
}
