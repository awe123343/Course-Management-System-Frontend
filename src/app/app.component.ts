import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(
        private router: Router,
        private accountService: AccountService
    ) {
        this.accountService.user.subscribe((x) => {
            this.user = x;

            this.items = [];
            this.loadNavBar();
        });
    }

    ngOnInit(): void {}

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

    goHome() {
        this.router.navigate(['/']);
    }

    loadNavBar() {
        if (this.isAdmin) {
            this.items.push({
                label: 'User Management',
                icon: 'pi pi-fw pi-user-edit',
                routerLink: '/admin/users',
            });
        }
        if (this.isEvaluator) {
            this.items.push(
                ...[
                    {
                        label: 'Course Material',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: '/evaluator/materials',
                    },
                    {
                        label: 'Grading Assignment',
                        icon: 'pi pi-fw pi-file',
                        routerLink: '/evaluator/grading',
                    },
                ]
            );
        }
        if (this.isAdmin || this.isEvaluator) {
            this.items.push({
                label: 'Course Management',
                icon: 'pi pi-fw pi-calendar-plus',
                items: [
                    {
                        label: 'Manage',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: '/courses',
                    },
                    {
                        label: 'Info',
                        icon: 'pi pi-fw pi-info',
                        routerLink: '/enrollment',
                    },
                ],
            });
        }
        if (this.isStudent) {
            this.items.push(...[{
                label: 'Courses',
                icon: 'pi pi-fw pi-calendar-plus',
                routerLink: '/student/course'
            },{
                label: 'Course Materials',
                icon: 'pi pi-fw pi-file-pdf',
                routerLink: '/student/assignment'
            }]);
        }
        if (this.isParent) {
            this.items.push({
                label: 'Children Grades',
                icon: 'pi pi-fw pi-calendar-plus',
                routerLink: '/parent/grades'
            });
        }
    }
}
