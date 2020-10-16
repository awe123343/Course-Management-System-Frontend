import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dialog, DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';

import { ParentRoutingModule } from './parent-routing.module';
import { LayoutComponent } from './layout.component';
import { AssignmentComponent } from './assignment.component';

@NgModule({
    declarations: [LayoutComponent, AssignmentComponent],
    imports: [
        CommonModule,
        ParentRoutingModule,
        ButtonModule,
        CardModule,
        DialogModule,
        PanelModule,
        TableModule,
        TabViewModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [MessageService],
})
export class ParentModule {}
