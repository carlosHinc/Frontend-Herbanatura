import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CreateLaboratoryGateway } from '@domain/laboratories/create-laboratory.gateway';
import {
  CreateLaboratory,
  Laboratory,
} from '@domain/laboratories/laboratories.entity';
import { HttpLaboratoryData } from './http-laboratories.response';
import { environment } from 'src/enviroments/enviroment';
import { LaboratoryMapper } from './mappers/get-laboratories.mapper';

@Injectable()
export class HttpCreateLaboratoryService implements CreateLaboratoryGateway {
  private readonly httpClient = inject(HttpClient);

  execute(nameLaboratory: CreateLaboratory): Observable<Laboratory> {
    return this.httpClient
      .post<HttpLaboratoryData>(
        `${environment.apiUrl}/laboratories`,
        nameLaboratory
      )
      .pipe(map((response) => LaboratoryMapper.fromHttp(response)));
  }
}
