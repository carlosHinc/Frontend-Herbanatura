import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CreateSupplierGateway } from '@domain/suppliers/create-supplier.gateway';
import { CreateSupplier, Supplier } from '@domain/suppliers/suppliers.entity';
import { HttpCreateSupplierResponse } from './http-suppliers.response';
import { environment } from 'src/enviroments/enviroment';
import { SupplierMapper } from './mappers/suppliers.mapper';

@Injectable()
export class HttpCreateSupplierService implements CreateSupplierGateway {
  private readonly httpClient = inject(HttpClient);

  execute(payload: CreateSupplier): Observable<Supplier> {
    return this.httpClient
      .post<HttpCreateSupplierResponse>(
        `${environment.apiUrl}/suppliers`,
        payload,
      )
      .pipe(map((r) => SupplierMapper.fromHttp(r.data)));
  }
}
