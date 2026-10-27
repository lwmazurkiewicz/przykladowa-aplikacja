import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private readonly adminService: AdminService,
        private readonly router: Router,
    ) { }

    canActivate(): boolean | UrlTree {
        if (this.adminService.isAdmin()) {
            return true;
        }

        return this.router.createUrlTree(['/']);
    }
}
