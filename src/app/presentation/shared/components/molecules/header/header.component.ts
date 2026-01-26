import { Component, EventEmitter, Input, Output } from '@angular/core';
import { H1Component } from '../../atoms/h1/h1.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { DsHeaderConfig } from './ds-header.interface';

@Component({
  selector: 'ds-header',
  standalone: true,
  imports: [H1Component, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() config!: DsHeaderConfig;

  @Output() buttonEvent = new EventEmitter<void>();

  buttonAction() {
    this.buttonEvent.emit();
  }
}
