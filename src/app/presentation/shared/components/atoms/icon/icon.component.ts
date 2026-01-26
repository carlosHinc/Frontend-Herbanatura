import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  icon = input.required<string>();

  modifiers = input<string>('');
}
