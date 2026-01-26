import { Component, Input } from '@angular/core';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
  selector: 'ds-loading',
  imports: [SpinnerComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input({ required: true }) text!: string;
}
