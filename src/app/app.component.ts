import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { Role } from './_models/role';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'Course Management System';

	user: User;
	items: MenuItem[];

	constructor(private accountService: AccountService) {
		this.accountService.user.subscribe((x) => (this.user = x));
	}

	ngOnInit(): void {
		this.items = [
			{
				label: 'User Management',
				icon: 'pi pi-fw pi-user-edit',
				routerLink: '/admin/users'
			},
			{
				label: 'Edit',
				icon: 'pi pi-fw pi-pencil',
				items: [
					{ label: 'Delete', icon: 'pi pi-fw pi-trash' },
					{ label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
				],
			},
		];
	}

	get isAdmin() {
		return this.user && this.user.role === Role.Admin;
	}

	get isParent() {
		return this.user && this.user.role === Role.Parent;
	}

	get isEvaluator() {
		return this.user && this.user.role === Role.Evaluator;
	}

	get isStudent() {
		return this.user && this.user.role === Role.Student;
	}

	logout() {
		this.accountService.logout();
	}
}
