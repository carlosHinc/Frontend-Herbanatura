import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { CreateLaboratoryUseCase } from '@application/use-cases/laboratories/creat-laboratory.usecase';
import { CreateLaboratory } from '@domain/laboratories/laboratories.entity';

@Injectable()
export class CreateLaboratoryViewModel {
  private readonly useCase = inject(CreateLaboratoryUseCase);

  async execute(nameLaboratory: CreateLaboratory) {
    return await this.createLaboratory(nameLaboratory);
  }

  private async createLaboratory(nameLaboratory: CreateLaboratory) {
    return lastValueFrom(this.useCase.execute(nameLaboratory));
  }
}
