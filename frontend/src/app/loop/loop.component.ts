import { DecimalPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [DecimalPipe, NgClass],
  selector: 'app-loop.component',
  styleUrl: './loop.component.scss',
  templateUrl: './loop.component.html',
})
export class LoopComponent {
  products: any[];
  constructor() {
    this.products = [
    {
      id: 1,
      name: 'Klawiatura',
      price: 149.99,
      available: true,
    },
    {
      id: 2398731,
      name: 'Mysz',
      price: 89.99,
      available: true,
    },
    {
      id: 393898713249812,
      name: 'Monitor',
      price: 1199.00,
      available: false,
    },
  ];
  }
}
