import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { LayoutComponent } from './layout.component';

@NgModule({
	declarations: [LoginComponent, RegisterComponent, LayoutComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AccountRoutingModule,
		ButtonModule,
		CardModule,
		InputTextModule,
		MessagesModule,
		MessageModule,
		PanelModule,
		PasswordModule,
		SharedModule,
		TooltipModule,
	],
	providers: [MessageService],
})
export class AccountModule {}
