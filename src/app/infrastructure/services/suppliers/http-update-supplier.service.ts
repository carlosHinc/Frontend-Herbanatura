import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UpdateSupplier } from '@domain/suppliers/suppliers.entity';
import { UpdateSupplierGateway } from '@domain/suppliers/update-supplier.gateway';
import { UpdateSupplierResponse } from '@domain/suppliers/suppliers.response';
import { HttpCreateSupplierResponse } from './http-suppliers.response';
import { environment } from 'src/enviroments/enviroment';
import { SupplierMapper } from './mappers/suppliers.mapper';

@Injectable()
export class HttpUpdateSupplierService implements UpdateSupplierGateway {
  private readonly httpClient = inject(HttpClient);

  execute(
    id: number,
    dataSupplier: UpdateSupplier
  ): Observable<UpdateSupplierResponse> {
    return this.httpClient
      .put<HttpCreateSupplierResponse>(
        `${environment.apiUrl}/suppliers/${id}`,
        dataSupplier
      )
      .pipe(
        map((response) => ({
          supplier: SupplierMapper.fromHttp(response.data),
        }))
      );
  }
}
