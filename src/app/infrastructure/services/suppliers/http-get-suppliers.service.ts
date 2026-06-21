import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GetSuppliersGateway } from '@domain/suppliers/get-suppliers.gateway';
import { GetSuppliersResponse } from '@domain/suppliers/suppliers.response';
import { HttpSupplierData } from './http-suppliers.response';
import { environment } from 'src/enviroments/enviroment';
import { SupplierMapper } from './mappers/suppliers.mapper';

interface HttpGetSuppliersResponse {
  data: { suppliers: HttpSupplierData[]; count: number };
}

@Injectable()
export class HttpGetSuppliersService implements GetSuppliersGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetSuppliersResponse> {
    return this.httpClient
      .get<HttpGetSuppliersResponse>(`${environment.apiUrl}/suppliers`)
      .pipe(
        map((r) => ({
          suppliers: r.data.suppliers.map(SupplierMapper.fromHttp),
          count: r.data.count,
        })),
      );
  }
}
