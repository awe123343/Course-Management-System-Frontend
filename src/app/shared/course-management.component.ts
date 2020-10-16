import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';
import { TableColumn } from '@app/_models/tableCol';
import { Course } from '@app/_models/course';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/role';

@Component({
    selector: 'app-course-management',
    templateUrl: './course-management.component.html',
    styleUrls: ['./course-management.component.css'],
})
export class CourseManagementComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    courses: Course[];
    course: Course;
    selectedCourses: Course[];
    displayCourseDialog: boolean;
    courseAddEditForm: FormGroup;
    inEditMode: boolean;
    evaluators: User[];

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private courseService: CourseService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'courseCode', header: 'Course Code' },
            { field: 'courseName', header: 'Course Name' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'evaluatorName', header: 'Evaluator' },
            { field: 'description', header: 'Description' },
        ];

        this.courseAddEditForm = this.formBuilder.group({
            courseCode: ['', Validators.required],
            courseName: ['', Validators.required],
            capacity: ['', [Validators.required, Validators.min(1)]],
            evaluatorId: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.fetchCourses();
    }
    get f() {
        return this.courseAddEditForm.controls;
    }

    get isAdmin() {
        return this.user && this.user.role === Role.Admin;
    }

    get isEvaluator() {
        return this.user && this.user.role === Role.Evaluator;
    }

    fetchCourses() {
        this.courseService
            .getAll()
            .pipe(first())
            .subscribe({
                next: async (courses) => {
                    this.courses = courses;
                    if (this.isEvaluator) {
                        this.courses = this.courses.filter(
                            (c) => c.evaluatorId === this.user.id
                        );
                    }

                    this.accountService
                        .getByRole(Role.Evaluator)
                        .pipe(first())
                        .subscribe({
                            next: (users) => {
                                this.evaluators = users;

                                this.courses.forEach((course) => {
                                    let evaluator: User = this.evaluators.find(
                                        (evaluator) =>
                                            evaluator.id === course.evaluatorId
                                    );
                                    course.evaluatorName = `${evaluator.firstName} ${evaluator.lastName}`;
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

                    console.log(this.courses);
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

    addEditCourse(courseForEdit: Course) {
        console.log('Course to update: ', courseForEdit);
        this.courseAddEditForm.reset();

        if (courseForEdit) {
            this.f.courseCode.setValue(courseForEdit.courseCode);
            this.f.courseName.setValue(courseForEdit.courseName);
            this.f.capacity.setValue(courseForEdit.capacity);
            this.f.evaluatorId.setValue(
                this.evaluators.find((e) => e.id === courseForEdit.evaluatorId)
            );
            this.f.description.setValue(courseForEdit.description);

            this.course = { ...courseForEdit };
            this.inEditMode = true;
        } else {
            this.course = {};
            this.inEditMode = false;
        }

        this.displayCourseDialog = true;
    }

    onCourseFormSubmit() {
        this.course.courseCode = this.f.courseCode.value;
        this.course.courseName = this.f.courseName.value;
        this.course.capacity = this.f.capacity.value;
        this.course.evaluatorId = this.f.evaluatorId.value.id;
        this.course.description = this.f.description.value;

        if (this.inEditMode) {
            let courseIndexInAllCourses = this.courses.findIndex(
                (c) => c.id === this.course.id
            );
            this.courses[courseIndexInAllCourses] = this.course;

            this.courseService
                .update(this.course.id, this.course)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Update successfully',
                            detail: `Successfully updated info for ${this.course.courseCode}`,
                        });

                        this.fetchCourses();
                        this.hideDialog();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error occured',
                            detail: error,
                        });
                    },
                });
        } else {
            this.courses.push(this.course);
            this.courseService
                .create(this.course)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Registration successful',
                            detail: `${this.course.courseCode} ${this.course.courseName} created`,
                        });

                        this.fetchCourses();
                        this.hideDialog();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error occured',
                            detail: error,
                        });
                    },
                });
        }
    }

    hideDialog() {
        this.displayCourseDialog = false;
        this.course = null;
    }
}
