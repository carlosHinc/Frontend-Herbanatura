import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateLaboratoryGateway } from '@domain/laboratories/create-laboratory.gateway';
import {
  CreateLaboratory,
  Laboratory,
} from '@domain/laboratories/laboratories.entity';

@Injectable()
export class CreateLaboratoryUseCase {
  private readonly gateway = inject(CreateLaboratoryGateway);

  execute(nameLaboratory: CreateLaboratory): Observable<Laboratory> {
    return this.gateway.execute(nameLaboratory);
  }
}
