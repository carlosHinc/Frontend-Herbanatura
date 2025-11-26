import { Observable } from 'rxjs';

import { CreateLaboratory, Laboratory } from './laboratories.entity';

export abstract class CreateLaboratoryGateway {
  abstract execute(nameLaboratory: CreateLaboratory): Observable<Laboratory>;
}
