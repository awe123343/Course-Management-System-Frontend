import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AccountService } from '@app/_services/account.service';
import { TableColumn } from '@app/_models/tableCol';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/role';

const pwdPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,16}$';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
    cols: TableColumn[];
    users: User[];
    user: User;
    selectedUsers: User[];
    displayUserDialog: boolean;
    userAddEditForm: FormGroup;
    inEditMode: boolean;
    roles: string[];
    selectedRole: Role;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cols = [
            { field: 'username', header: 'Username' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'role', header: 'Role' },
        ];

        this.userAddEditForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', [Validators.required, Validators.minLength(4)]],
            role: ['', Validators.required],
            password: ['', Validators.pattern(pwdPattern)],
        });

        this.roles = Object.values(Role);

        this.fetchUserList();
    }

    get f() {
        return this.userAddEditForm.controls;
    }

    addEditUser(userForEdit: User) {
        console.log('User to update: ', userForEdit);

        this.userAddEditForm.reset();

        this.f.password.clearValidators();
        if (userForEdit) {
            this.f.username.setValue(userForEdit.username);
            this.f.firstName.setValue(userForEdit.firstName);
            this.f.lastName.setValue(userForEdit.lastName);
            this.f.role.setValue(userForEdit.role);

            this.f.password.setValidators([Validators.pattern(pwdPattern)]);
            this.user = { ...userForEdit };
            this.inEditMode = true;
        } else {
            this.f.password.setValidators([
                Validators.required,
                Validators.pattern(pwdPattern),
            ]);
            this.user = {};
            this.inEditMode = false;
        }
        this.f.password.updateValueAndValidity();

        this.displayUserDialog = true;
    }

    onUserFormSubmit() {
        this.user.username = this.f.username.value;
        this.user.firstName = this.f.firstName.value;
        this.user.lastName = this.f.lastName.value;
        this.user.role = this.f.role.value;
        if (this.f.password.value && this.f.password.value.trim()) {
            this.user.password = this.f.password.value;
        }

        if (this.inEditMode) {
            let userIndexInAllUsers = this.users.findIndex(
                (u) => u.id === this.user.id
            );
            this.users[userIndexInAllUsers] = this.user;

            this.accountService
                .update(this.user.id, this.userAddEditForm.value)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Update successfully',
                            detail: `Successfully updated info for ${this.user.username}`,
                        });
                        this.fetchUserList();
                        this.displayUserDialog = false;
                        this.user = null;
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error occured',
                            detail: error,
                        });
                    },
                });
        } else {
            this.users.push(this.user);
            this.accountService
                .register(this.userAddEditForm.value)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Registration successful',
                            detail: `${this.user.role} ${this.user.username} registered`,
                        });
                        this.fetchUserList();
                        this.displayUserDialog = false;
                        this.user = null;
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error occured',
                            detail: error,
                        });
                    },
                });
        }
    }

    hideDialog() {
        this.displayUserDialog = false;
        this.user = null;
    }

    fetchUserList() {
        this.accountService
            .getAll()
            .pipe(first())
            .subscribe({
                next: (users) => {
                    this.users = users;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error occured',
                        detail: error,
                    });
                    console.log(error);
                },
            });
    }

    deleteUser(id: number) {
        this.users = this.users.filter((u) => u.id !== id);
        this.accountService
            .delete(id.toString())
            .pipe(first())
            .subscribe(
                () => (this.users = this.users.filter((u) => u.id !== id))
            );
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete the selected user accounts?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users = this.users.filter(
                    (val) =>
                        !this.selectedUsers
                            .map((selectedU) => selectedU.id)
                            .includes(val.id)
                );
                this.selectedUsers.forEach((u) => this.deleteUser(u.id));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User accounts Deleted',
                    life: 3000,
                });
            },
        });
    }
}
