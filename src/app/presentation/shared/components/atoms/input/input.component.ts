import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ds-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  type = input<string>('text');
  value = input<string>('');
  placeholder = input<string>('Buscar...');
  class = input<string>('');

  valueChange = output<string>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
