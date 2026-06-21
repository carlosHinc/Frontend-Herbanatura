import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterViewModel } from '@presentation/view-models/auth/register.view-model';
import { RegisterUseCase } from '@application/use-cases/auth/register.usecase';
import { RegisterGateway } from '@domain/auth/register.gateway';
import { HttpRegisterService } from '@infrastructure/services/auth/http-register.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  providers: [
    RegisterViewModel,
    RegisterUseCase,
    { provide: RegisterGateway, useClass: HttpRegisterService },
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  protected readonly vm = inject(RegisterViewModel);
  private readonly router = inject(Router);
  protected readonly loading = computed(() => this.vm.state().loading);
  protected readonly error = computed(() => this.vm.state().error);
  protected readonly success = computed(() => this.vm.state().success);

  constructor() {
    effect(() => {
      if (this.vm.state().success) {
        console.log('Registration successful, redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 3500);
      }
    });
  }

  protected username = '';
  protected name = '';
  protected email = '';
  protected password = '';
  protected idRole = 1;

  onSubmit(): void {
    if (!this.name || !this.username || !this.email || !this.password) return;
    this.vm.register({
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      idRole: this.idRole,
    });
  }
}
