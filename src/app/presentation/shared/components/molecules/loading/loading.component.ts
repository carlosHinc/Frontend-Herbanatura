import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input({ required: true }) text!: string;
}
