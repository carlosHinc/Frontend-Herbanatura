import { Observable } from 'rxjs';
import { GetSaleDetailsResponse } from './sales.response';

export abstract class GetSaleDetailsGateway {
  abstract execute(idSale: number): Observable<GetSaleDetailsResponse>;
}
