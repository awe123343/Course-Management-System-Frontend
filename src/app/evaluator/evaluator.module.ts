import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { EvaluatorRoutingModule } from './evaluator-routing.module';
import { LayoutComponent } from './layout.component';
import { MaterialManagementComponent } from './material-management.component';
import { GradingComponent } from './grading.component';

@NgModule({
    declarations: [
        LayoutComponent,
        MaterialManagementComponent,
        GradingComponent,
    ],
    imports: [
        CommonModule,
        EvaluatorRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextModule,
        MessageModule,
        PanelModule,
        PasswordModule,
        RadioButtonModule,
        SelectButtonModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
    ],
    providers: [ConfirmationService, MessageService],
})
export class EvaluatorModule {}
