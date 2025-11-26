import { Component, EventEmitter, Input, Output } from '@angular/core';
import { H1Component } from '../../atoms/h1/h1.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { H1ConfigurationInterface } from '../../atoms/h1/h1.interface';
import { ButtonConfigurationInterface } from '../../atoms/button/button.interface';

@Component({
  selector: 'ds-header',
  imports: [H1Component, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() configH1!: H1ConfigurationInterface;

  @Input() configButton!: ButtonConfigurationInterface;

  @Output() buttonEvent = new EventEmitter<void>();

  buttonAction() {
    this.buttonEvent.emit();
  }
}
