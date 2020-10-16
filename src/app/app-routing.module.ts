import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AssignmentOverviewComponent } from './shared/assignment-overview.component';
import { EnrollInfoComponent } from './shared/enroll-info.component';
import { CourseManagementComponent } from './shared/course-management.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';

const accountModule = () =>
    import('./account/account.module').then((x) => x.AccountModule);
const adminModule = () =>
    import('./admin/admin.module').then((x) => x.AdminModule);
const evaluatorModule = () =>
    import('./evaluator/evaluator.module').then((x) => x.EvaluatorModule);
const studentModule = () =>
    import('./student/student.module').then((x) => x.StudentModule);
const parentModule = () =>
    import('./parent/parent.module').then((x) => x.ParentModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    {
        path: 'admin',
        loadChildren: adminModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
    },
    {
        path: 'evaluator',
        loadChildren: evaluatorModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Evaluator] },
    },
    {
        path: 'student',
        loadChildren: studentModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Student] },
    },
    {
        path: 'parent',
        loadChildren: parentModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Parent] },
    },
    {
        path: 'assignmentoverview',
        component: AssignmentOverviewComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Evaluator] },
    },
    {
        path: 'courses',
        component: CourseManagementComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Evaluator] },
    },
    {
        path: 'enrollment',
        component: EnrollInfoComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Evaluator] },
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
