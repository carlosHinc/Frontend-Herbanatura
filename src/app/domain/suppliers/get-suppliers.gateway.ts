import { Observable } from 'rxjs';
import { GetSuppliersResponse } from '@domain/suppliers/suppliers.response';

export abstract class GetSuppliersGateway {
  abstract execute(): Observable<GetSuppliersResponse>;
}
