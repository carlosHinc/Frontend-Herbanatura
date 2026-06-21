import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  RegisterGateway,
  RegisterPayload,
} from '@domain/auth/register.gateway';
import { RegisterResponse } from '@domain/auth/auth.response';
import { environment } from '../../../../enviroments/enviroment';

interface HttpRegisterResponse {
  message: string;
  data: {
    id: number;
    name: string;
    username: string;
    email: string;
    created_at: string;
  };
}

@Injectable()
export class HttpRegisterService implements RegisterGateway {
  private readonly httpClient = inject(HttpClient);

  execute(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.httpClient
      .post<HttpRegisterResponse>(
        `${environment.apiUrl}/auth/register`,
        payload,
      )
      .pipe(
        map((response) => ({
          user: {
            id: response.data.id,
            name: response.data.name,
            username: response.data.username,
            email: response.data.email,
            role: '',
          },
        })),
      );
  }
}
