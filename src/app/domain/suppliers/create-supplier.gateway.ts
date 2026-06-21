import { Observable } from 'rxjs';
import { CreateSupplier, Supplier } from './suppliers.entity';

export abstract class CreateSupplierGateway {
  abstract execute(payload: CreateSupplier): Observable<Supplier>;
}
