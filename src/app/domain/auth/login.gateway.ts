import { Observable } from 'rxjs';
import { LoginResponse } from './auth.response';

export abstract class LoginGateway {
  abstract execute(
    username: string,
    password: string,
  ): Observable<LoginResponse>;
}
