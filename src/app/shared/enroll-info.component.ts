import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Role } from '@app/_models/role';
import { User } from '@app/_models/user';
import { Course } from '@app/_models/course';
import { CourseMaterial } from '@app/_models/course-material';
import { Assignment } from '@app/_models/assignment';
import { TableColumn } from '@app/_models/tableCol';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';
import { CourseMaterialService } from '@app/_services/course-material.service';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-enroll-info',
    templateUrl: './enroll-info.component.html',
    styleUrls: ['./enroll-info.component.css'],
})
export class EnrollInfoComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    courses: Course[];
    displayDialog: boolean;
    displaySubmissionPanel: boolean;
    assignments: Assignment[];
    materials: CourseMaterial[];
    selectedCourse: Course;
    selectedStudent: User;
    selectedSubmission: Assignment;

    constructor(
        private accountService: AccountService,
        private courseService: CourseService,
        private courseMaterialService: CourseMaterialService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'username', header: 'Username' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'role', header: 'Role' },
        ];

        if (this.isAdmin) {
            this.courseService
                .getAllWithEnrollment()
                .pipe(first())
                .subscribe({
                    next: (courses) => {
                        this.courses = courses;
                        console.log(courses);
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
        } else if (this.isEvaluator) {
            this.courseService
                .getCourseForEvaluator(this.user.id)
                .pipe(first())
                .subscribe({
                    next: (courses) => {
                        this.courses = courses;
                        console.log(courses);
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

    get isAdmin() {
        return this.user && this.user.role === Role.Admin;
    }

    get isEvaluator() {
        return this.user && this.user.role === Role.Evaluator;
    }

    getMaterialTitle(id: number) {
        return this.materials.find((m) => m.id === id).title;
    }

    getMaterialContent(id: number) {
        return this.materials.find((m) => m.id === id).content;
    }

    viewSubmission(assignment: Assignment) {
        this.selectedSubmission = assignment;
        this.displaySubmissionPanel = true;
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
}
