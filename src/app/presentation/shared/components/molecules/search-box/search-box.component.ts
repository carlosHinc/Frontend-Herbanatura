import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../atoms/input/input.component';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'ds-search-box',
  standalone: true,
  imports: [CommonModule, InputComponent, IconButtonComponent, IconComponent],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  // Inputs
  value = input<string>('');
  placeholder = input<string>('Buscar...');

  // Outputs
  valueChange = output<string>();
  clear = output<void>();

  onInputChange(value: string): void {
    this.valueChange.emit(value);
  }

  onClear(): void {
    this.clear.emit();
  }
}
