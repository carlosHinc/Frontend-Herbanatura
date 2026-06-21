import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginGateway } from '@domain/auth/login.gateway';
import { LoginResponse } from '@domain/auth/auth.response';

@Injectable()
export class LoginUseCase {
  private readonly gateway = inject(LoginGateway);

  execute(username: string, password: string): Observable<LoginResponse> {
    return this.gateway.execute(username, password);
  }
}
