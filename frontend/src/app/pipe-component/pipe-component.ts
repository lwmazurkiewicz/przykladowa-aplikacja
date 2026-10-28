import { Component } from '@angular/core';
import {
  UpperCasePipe,
  DatePipe,
  CurrencyPipe,
  PercentPipe,
  DecimalPipe,
  JsonPipe
} from '@angular/common';

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [
    UpperCasePipe,
    DatePipe,
    CurrencyPipe,
    PercentPipe,
    DecimalPipe,
    JsonPipe
  ],
  templateUrl: './pipe-component.html'
})
export class PipeComponent {

  courseName = 'Angular';

  currentDate = new Date();

  price = 1234.567;

  successRate = 0.8735;

  pi = Math.PI;

  theorem = {
    id: 1,
    type: 'THEOREM',
    name: 'Twierdzenie Pitagorasa'
  };
}