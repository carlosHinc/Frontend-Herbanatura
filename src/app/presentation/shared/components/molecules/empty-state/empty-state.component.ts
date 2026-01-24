import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ds-empty-state',
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  message = input.required<string>();

  textBtn = input<string | undefined>(undefined);

  onClickEvent = output<void>();

  onClick() {
    this.onClickEvent.emit();
  }
}
