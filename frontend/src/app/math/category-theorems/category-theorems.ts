import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MathService } from '../api/math.service';
import { MathMode } from '../math-mode/math-mode';
import { Theorem } from '../api/Theorem';

@Component({
  selector: 'app-category-theorems',
  standalone: true,
  imports: [CommonModule, MathMode, RouterLink],
  templateUrl: './category-theorems.html'
})
export class CategoryTheoremsComponent {

  theorems$: Observable<Theorem[]>;

  constructor(
    private route: ActivatedRoute,
    private mathService: MathService
  ) {
    this.theorems$ = this.route.paramMap.pipe(
      switchMap(params => this.mathService.getTheoremsForCategory(Number(params.get('id'))))
    );
  }

  badgeClass(type: string): string {
    switch (type) {
      case 'DEFINITION':
        return 'bg-primary';
      case 'THEOREM':
        return 'bg-success';
      case 'LEMMA':
        return 'bg-warning text-dark';
      case 'AXIOM':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  polishType(type: string): string {
    switch (type) {
      case 'DEFINITION':
        return 'Definicja';
      case 'THEOREM':
        return 'Twierdzenie';
      case 'LEMMA':
        return 'Lemat';
      case 'AXIOM':
        return 'Aksjomat';
      default:
        return type;
    }
  }
}
