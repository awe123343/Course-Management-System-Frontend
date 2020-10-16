import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Course } from '@app/_models/course';
import { User } from '@app/_models/user';
import { TableColumn } from '@app/_models/tableCol';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    allCourses: Course[];
    myCourses: Course[];

    constructor(
        private courseService: CourseService,
        private accountService: AccountService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'courseCode', header: 'Course Code' },
            { field: 'courseName', header: 'Course Name' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'currentStuNo', header: 'Current Registration' },
            { field: 'description', header: 'Description' },
        ];

        this.fetchCourseList();
    }

    fetchCourseList() {
        this.courseService
            .getCourseByStudent(this.user.id)
            .pipe(first())
            .subscribe({
                next: (courses) => {
                    this.myCourses = courses;
                    console.log('My courses', this.myCourses);

                    this.courseService
                        .getAllForDisplay()
                        .pipe(first())
                        .subscribe({
                            next: (allCourses) => {
                                this.allCourses = allCourses;
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

    enroll(course: Course) {
        this.confirmationService.confirm({
            message: `Are you sure you want to enroll ${course.courseCode}: ${course.courseName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.courseService
                    .enroll(this.user.id, course.id)
                    .pipe(first())
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: `${course.courseCode} enrolled`,
                                life: 3000,
                            });
                            this.fetchCourseList();
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
        });
    }

    deEnroll(course: Course) {
        this.confirmationService.confirm({
            message: `Are you sure you want to disenroll ${course.courseCode}: ${course.courseName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.courseService
                    .deEnroll(course.enrollmentId)
                    .pipe(first())
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: `${course.courseCode} disenrolled`,
                                life: 3000,
                            });
                            this.fetchCourseList();
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
        });
    }

    getDisplayContent(field, row: Course) {
        let res;
        if (field === 'description') {
            res =
                row.description.length > 60
                    ? `${row.description.substring(0, 60)}..`
                    : row.description;
        } else if (field === 'currentStuNo') {
            res = `${row.currentStuNo}/${row.capacity}`;
        } else {
            res = row[field];
        }
        return res;
    }

    canEnroll(row: Course): boolean {
        let res: boolean = true;
        if (
            row.currentStuNo >= row.capacity ||
            this.myCourses.map((c) => c.id).includes(row.id)
        ) {
            res = false;
        }

        return res;
    }
}
