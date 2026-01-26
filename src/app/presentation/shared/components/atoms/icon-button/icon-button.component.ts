import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ds-icon-button',
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  click = output<void>();

  title = input<string>('');

  icon = input.required<string>();

  onClick() {
    this.click.emit();
  }
}
