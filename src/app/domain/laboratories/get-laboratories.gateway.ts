import { Observable } from 'rxjs';

import { GetLaboratoriesResponse } from './laboratories.response';

export abstract class GetLaboratoriesGateway {
  abstract execute(): Observable<GetLaboratoriesResponse>;
}
