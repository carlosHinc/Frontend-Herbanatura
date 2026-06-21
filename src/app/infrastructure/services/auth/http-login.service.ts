import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LoginGateway } from '@domain/auth/login.gateway';
import { LoginResponse, SystemActionsCode } from '@domain/auth/auth.response';
import { environment } from '../../../../enviroments/enviroment';

interface HttpLoginResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      role: string;
    };
    permissions: Array<{
      id: number;
      action: string;
      code: string;
    }>;
  };
}

@Injectable()
export class HttpLoginService implements LoginGateway {
  private readonly httpClient = inject(HttpClient);

  execute(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient
      .post<HttpLoginResponse>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((response) => ({
          token: response.data.token,
          user: response.data.user,
          permissions: response.data.permissions.map((perm) => ({
            action: perm.action,
            code: perm.code as SystemActionsCode,
          })),
        })),
      );
  }
}
