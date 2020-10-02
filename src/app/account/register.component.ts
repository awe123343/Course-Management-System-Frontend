import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services/account.service';
import { MessageService } from 'primeng/api';

const pwdPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,16}$';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	form: FormGroup;
	loading = false;
	submitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			username: ['', [Validators.required, Validators.minLength(4)]],
			password: [
				'',
				[Validators.required, Validators.pattern(pwdPattern)],
			],
			role: [''],
		});
		this.form.controls.role.patchValue('Student');
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	onSubmit() {
        this.submitted = true;

		// reset alerts on submit
		this.messageService.clear();

		// stop here if form is invalid
		if (this.form.invalid) {
			return;
		}

		this.loading = true;
		this.accountService
			.register(this.form.value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.messageService.add({
						severity: 'success',
						summary: 'Registration successful',
						detail: `${this.form.value.username} registered`,
					});
					this.router.navigate(['../login'], {
						relativeTo: this.route,
					});
				},
				error: (error) => {
					this.messageService.add({
						severity: 'error',
						summary: 'Error occured',
						detail: error,
					});
					this.loading = false;
				},
			});
	}

	navToLogin() {
		this.router.navigate(['/account/login']);
	}
}
