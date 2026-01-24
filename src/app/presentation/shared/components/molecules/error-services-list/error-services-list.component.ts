import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ds-error-services-list',
  imports: [],
  templateUrl: './error-services-list.component.html',
  styleUrl: './error-services-list.component.scss',
})
export class ErrorServicesListComponent {
  errorMessage = input.required<string>();
  textBtn = input<string | undefined>(undefined);

  onClick = output<void>({ alias: 'retry' });

  retry() {
    this.onClick.emit();
  }
}
