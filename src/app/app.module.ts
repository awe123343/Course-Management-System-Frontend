import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { HomeComponent } from './home/home.component';
import { AssignmentOverviewComponent } from './shared/assignment-overview.component';
import { CourseManagementComponent } from './shared/course-management.component';
import { EnrollInfoComponent } from './shared/enroll-info.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AssignmentOverviewComponent,
        CourseManagementComponent,
        EnrollInfoComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ButtonModule,
        CardModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        InputTextareaModule,
        InputTextModule,
        MenubarModule,
        PanelModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        SharedModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        ConfirmationService,
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
