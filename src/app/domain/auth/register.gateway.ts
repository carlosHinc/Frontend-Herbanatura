import { Observable } from 'rxjs';
import { RegisterResponse } from './auth.response';

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  idRole: number;
}

export abstract class RegisterGateway {
  abstract execute(payload: RegisterPayload): Observable<RegisterResponse>;
}
