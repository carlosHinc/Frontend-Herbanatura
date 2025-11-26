import { Component, Input } from '@angular/core';
import { H1ConfigurationInterface } from './h1.interface';

@Component({
  selector: 'ds-h1',
  imports: [],
  templateUrl: './h1.component.html',
  styleUrl: './h1.component.scss',
})
export class H1Component {
  @Input() configH1!: H1ConfigurationInterface;
}
