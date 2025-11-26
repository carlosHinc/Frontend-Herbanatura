import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfigurationInterface } from './button.interface';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() configButton!: ButtonConfigurationInterface;

  @Output() actionEvent = new EventEmitter<void>();

  actionButton() {
    this.actionEvent.emit();
  }
}
