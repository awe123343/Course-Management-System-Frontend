import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Role } from '@app/_models/role';
import { User } from '@app/_models/user';
import { Course } from '@app/_models/course';
import { CourseMaterial } from '@app/_models/course-material';
import { Assignment } from '@app/_models/assignment';
import { AccountService } from '@app/_services/account.service';
import { CourseMaterialService } from '@app/_services/course-material.service';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-assignment',
    templateUrl: './assignment.component.html',
    styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
    user: User;
    children: User[];
    evaluators: User[];
    displayDialog: boolean;
    displaySubmissionPanel: boolean;
    assignments: Assignment[];
    materials: CourseMaterial[];
    selectedCourse: Course;
    selectedStudent: User;
    selectedSubmission: Assignment;

    constructor(
        private accountService: AccountService,
        private courseMaterialService: CourseMaterialService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
    }

    ngOnInit(): void {
        this.fetchInfo();

        this.courseMaterialService
            .getAll()
            .pipe(first())
            .subscribe({
                next: (materials) => {
                    this.materials = materials;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error occured',
                        detail: error,
                    });
                    console.log(error);
                },
            });
    }

    viewAssignment(student: User, course: Course) {
        this.selectedCourse = course;
        this.selectedStudent = student;
        this.selectedSubmission = null;
        this.displaySubmissionPanel = false;

        this.courseMaterialService
            .getAssignmentByStudentCourse(student.id, course.id)
            .pipe(first())
            .subscribe({
                next: (assignments) => {
                    this.assignments = assignments;
                    this.displayDialog = true;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error occured',
                        detail: error,
                    });
                    console.log(error);
                },
            });
    }

    viewSubmission(assignment: Assignment) {
        this.selectedSubmission = assignment;
        this.displaySubmissionPanel = true;
    }

    getMaterialTitle(id: number) {
        return this.materials.find((m) => m.id === id).title;
    }

    getMaterialContent(id: number) {
        return this.materials.find((m) => m.id === id).content;
    }

    fetchInfo() {
        this.accountService
            .getByRole(Role.Evaluator)
            .pipe(first())
            .subscribe({
                next: (users) => {
                    this.evaluators = users;

                    this.accountService
                        .getChildrenCourses(this.user.id)
                        .pipe(first())
                        .subscribe({
                            next: (children) => {
                                children.forEach((child) => {
                                    child.courses.forEach((c) => {
                                        let currEvaluator = this.evaluators.find(
                                            (u) => u.id === c.evaluatorId
                                        );
                                        c.evaluatorName = `${currEvaluator.firstName} ${currEvaluator.lastName}`;
                                    });
                                });
                                this.children = children;

                                console.log('Children', this.children);
                            },
                            error: (error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error occured',
                                    detail: error,
                                });
                                console.log(error);
                            },
                        });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error occured',
                        detail: error,
                    });
                    console.log(error);
                },
            });
    }
}
