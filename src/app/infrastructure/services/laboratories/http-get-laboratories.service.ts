import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/enviroments/enviroment';

import { GetLaboratoriesGateway } from '@domain/laboratories/get-laboratories.gateway';
import { GetLaboratoriesResponse } from '@domain/laboratories/laboratories.response';
import { HttpGetLaboratoriesResponse } from './http-laboratories.response';
import { LaboratoryMapper } from './mappers/get-laboratories.mapper';

@Injectable()
export class HttpGetLaboratoriesService implements GetLaboratoriesGateway {
  private readonly httpClient = inject(HttpClient);

  execute(): Observable<GetLaboratoriesResponse> {
    return this.httpClient
      .get<HttpGetLaboratoriesResponse>(`${environment.apiUrl}/laboratories`)
      .pipe(
        map((response) => ({
          laboratories: response.data.map(LaboratoryMapper.fromHttp),
        }))
      );
  }
}
