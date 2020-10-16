import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { GradingComponent } from './grading.component';
import { MaterialManagementComponent } from './material-management.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: MaterialManagementComponent },
            { path: 'grading', component: GradingComponent },
            { path: 'materials', component: MaterialManagementComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EvaluatorRoutingModule {}
