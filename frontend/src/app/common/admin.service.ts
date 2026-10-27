import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminService {
	private readonly adminStatus = signal(true);
	readonly isAdmin = this.adminStatus.asReadonly();

	setAdminStatus(isAdmin: boolean): void {
		this.adminStatus.set(isAdmin);
	}
}
