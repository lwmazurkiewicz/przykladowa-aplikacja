import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { MathService } from '../api/math.service';

@Component({
  imports: [AsyncPipe, FormsModule, RouterLink, RouterOutlet],
  selector: 'app-math-home',
  styleUrl: './math-home.scss',
  templateUrl: './math-home.html',
})
export class MathHome {
  @ViewChild('dismissLoginModal') private dismissLoginModal?: ElementRef<HTMLButtonElement>;

  categories: Observable<any>;
  username = '';
  password = '';
  loginError = '';
  loggedIn = signal(false);

  constructor(private mathService: MathService) {
    this.categories = mathService.getCategories();
    mathService.refreshToken().subscribe(() => this.loggedIn.set(true));
  }

  login(): void {
    this.loginError = '';
    this.mathService.login(this.username, this.password).subscribe({
      next: () => {
        this.username = '';
        this.password = '';
        this.dismissLoginModal?.nativeElement.click();
        this.loggedIn.set(true);
      },
      error: () => {
        this.loginError = 'Nie udało się zalogować. Sprawdź login i hasło.';
      }
    });
  }

  logout(): void {
    this.mathService.logout().subscribe(() => { this.loggedIn.set(false); });
  }
}
