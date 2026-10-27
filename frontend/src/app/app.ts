import { Component, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from './common/admin.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly isAdmin: Signal<boolean>;

  constructor(
    private readonly adminService: AdminService,
  ) {
    this.isAdmin = this.adminService.isAdmin;
  }

  protected setAdminStatus(event: Event): void {
    this.adminService.setAdminStatus((event.target as HTMLInputElement).checked);
  }
}
