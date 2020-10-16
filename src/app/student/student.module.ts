import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { StudentRoutingModule } from './student-routing.module';
import { AssignmentComponent } from './assignment.component';
import { CourseComponent } from './course.component';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [AssignmentComponent, CourseComponent, LayoutComponent],
    imports: [
        CommonModule,
        FormsModule,
        StudentRoutingModule,
        ButtonModule,
        CardModule,
        CheckboxModule,
        ConfirmDialogModule,
        DialogModule,
        EditorModule,
        InputTextModule,
        PanelModule,
        TableModule,
        TabViewModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [ConfirmationService, MessageService],
})
export class StudentModule {}
