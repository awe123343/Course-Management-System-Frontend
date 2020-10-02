import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AdminRoutingModule } from './admin-routing.module';
import { UserManagementComponent } from './user-management.component';
import { LayoutComponent } from './layout.component';

@NgModule({
	declarations: [UserManagementComponent, LayoutComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AdminRoutingModule,
		ButtonModule,
		CardModule,
		ConfirmDialogModule,
		DialogModule,
		DropdownModule,
		InputTextModule,
		MessageModule,
		PasswordModule,
		RadioButtonModule,
		SharedModule,
		TableModule,
		ToastModule,
		ToolbarModule,
		TooltipModule,
	],
	providers: [ConfirmationService, MessageService],
})
export class AdminModule {}
