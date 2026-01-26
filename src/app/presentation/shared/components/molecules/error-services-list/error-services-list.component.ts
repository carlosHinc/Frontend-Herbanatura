import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ButtonConfigurationInterface } from '../../atoms/button/button.interface';

@Component({
  selector: 'ds-error-services-list',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './error-services-list.component.html',
  styleUrl: './error-services-list.component.scss',
})
export class ErrorServicesListComponent {
  errorMessage = input.required<string>();

  onClick = output<void>({ alias: 'retry' });

  configButton = input<ButtonConfigurationInterface>();

  retry() {
    this.onClick.emit();
  }
}
