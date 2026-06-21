import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './presentation/shared/components/sidebar/sidebar.component';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly authTokenService = inject(AuthTokenService);
  protected readonly router = inject(Router);

  protected showDashboard(): boolean {
    return (
      this.authTokenService.isAuthenticated() &&
      !this.router.url.startsWith('/auth')
    );
  }
}
