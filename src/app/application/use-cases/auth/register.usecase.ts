import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RegisterGateway,
  RegisterPayload,
} from '@domain/auth/register.gateway';
import { RegisterResponse } from '@domain/auth/auth.response';

@Injectable()
export class RegisterUseCase {
  private readonly gateway = inject(RegisterGateway);

  execute(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.gateway.execute(payload);
  }
}
