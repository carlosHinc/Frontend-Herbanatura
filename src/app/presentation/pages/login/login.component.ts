import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginViewModel } from '@presentation/view-models/auth/login.view-model';
import { LoginUseCase } from '@application/use-cases/auth/login.usecase';
import { LoginGateway } from '@domain/auth/login.gateway';
import { HttpLoginService } from '@infrastructure/services/auth/http-login.service';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  providers: [
    LoginViewModel,
    LoginUseCase,
    { provide: LoginGateway, useClass: HttpLoginService },
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  protected readonly vm = inject(LoginViewModel);
  private readonly authTokenService = inject(AuthTokenService);
  protected readonly loading = computed(() => this.vm.state().loading);
  protected readonly error = computed(() => this.vm.state().error);

  protected username = '';
  protected password = '';

  ngOnInit(): void {
    this.authTokenService.clearSession();
  }

  onSubmit(): void {
    if (!this.username || !this.password) return;
    this.vm.login(this.username, this.password);
  }
}
