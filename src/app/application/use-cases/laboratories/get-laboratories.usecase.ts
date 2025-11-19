import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetLaboratoriesGateway } from '@domain/laboratories/get-laboratories.gateway';
import { GetLaboratoriesResponse } from '@domain/laboratories/laboratories.response';

@Injectable()
export class GetLaboratoriesUseCase {
  private readonly gateway = inject(GetLaboratoriesGateway);

  execute(): Observable<GetLaboratoriesResponse> {
    return this.gateway.execute();
  }
}
