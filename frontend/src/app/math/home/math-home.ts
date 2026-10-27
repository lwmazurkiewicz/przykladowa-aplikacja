import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { MathService } from '../api/math.service';

@Component({
  imports: [AsyncPipe, RouterLink, RouterOutlet],
  selector: 'app-math-home',
  styleUrl: './math-home.scss',
  templateUrl: './math-home.html',
})
export class MathHome {
  categories: Observable<any>
  constructor(private mathService: MathService) {
    this.categories = mathService.getCategories();
  }
}
