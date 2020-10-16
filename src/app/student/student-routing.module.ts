import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmentComponent } from './assignment.component';
import { CourseComponent } from './course.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: CourseComponent },
            { path: 'course', component: CourseComponent },
            { path: 'assignment', component: AssignmentComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentRoutingModule {}
