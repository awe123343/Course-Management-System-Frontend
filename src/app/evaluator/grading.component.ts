import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { MessageService } from 'primeng/api';

import { Course } from '@app/_models/course';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/role';
import { CourseMaterial } from '@app/_models/course-material';
import { Assignment } from '@app/_models/assignment';
import { Grading } from '@app/_models/grading';
import { TableColumn } from '@app/_models/tableCol';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';
import { CourseMaterialService } from '@app/_services/course-material.service';

@Component({
    selector: 'app-grading',
    templateUrl: './grading.component.html',
    styleUrls: ['./grading.component.css'],
})
export class GradingComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    students: User[];
    courses: Course[];
    submissions: Assignment[];
    assignments: CourseMaterial[];
    submissionCourseMap: Map<number, Grading>;
    groupedSubmissions: Grading[];
    displayDialog: boolean;
    assignmentInGrading: Assignment;

    constructor(
        private courseService: CourseService,
        private courseMaterialService: CourseMaterialService,
        private accountService: AccountService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
        this.submissionCourseMap = new Map();
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'studentId', header: 'Student' },
            { field: 'grades', header: 'Grade' },
        ];

        this.fetchStudents();
        this.fetchSubmissions();
    }

    getStudentName(id: number): string {
        let stu = this.students.find((stu) => stu.id === id);
        let name = `${stu.firstName} ${stu.lastName}`;
        return name;
    }

    gradeAssignment(submission: Assignment) {
        this.assignmentInGrading = { ...submission };
        if (!this.assignmentInGrading.grades) {
            this.assignmentInGrading.grades = 0;
        }
        this.displayDialog = true;
    }

    submitGrade() {
        console.log(this.assignmentInGrading);

        this.courseMaterialService
            .gradeAssignment(
                this.assignmentInGrading.id,
                this.assignmentInGrading.grades
            )
            .pipe(first())
            .subscribe({
                next: () => {
                    this.fetchStudents();
                    this.fetchSubmissions();
                    this.hideDialog();

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Grade uploaded',
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

    hideDialog() {
        this.assignmentInGrading = null;
        this.displayDialog = false;
    }

    fetchStudents() {
        this.accountService
            .getByRole(Role.Student)
            .pipe(first())
            .subscribe({
                next: (users) => {
                    this.students = users;
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

    fetchSubmissions() {
        this.submissionCourseMap = new Map();

        this.courseService
            .getCourseForEvaluator(this.user.id)
            .pipe(first())
            .subscribe({
                next: (courses) => {
                    this.courses = courses;

                    this.courseMaterialService
                        .getByEvaluator(this.user.id)
                        .pipe(first())
                        .subscribe({
                            next: (assignments) => {
                                this.assignments = assignments;
                                this.assignments.forEach((assignment) => {
                                    let currCourse: Course = this.courses.find(
                                        (c) => c.id === assignment.courseId
                                    );
                                    assignment.courseCode =
                                        currCourse.courseCode;
                                    assignment.courseName =
                                        currCourse.courseName;
                                });

                                this.courseMaterialService
                                    .getAssignmentByEvaluator(this.user.id)
                                    .pipe(first())
                                    .subscribe({
                                        next: (submissions) => {
                                            this.submissions = submissions;

                                            this.submissions.forEach(
                                                (submission) => {
                                                    let currAssignment: CourseMaterial = this.assignments.find(
                                                        (a) =>
                                                            a.id ===
                                                            submission.courseMaterialId
                                                    );

                                                    if (
                                                        this.submissionCourseMap.has(
                                                            submission.courseMaterialId
                                                        )
                                                    ) {
                                                        let value = this.submissionCourseMap.get(
                                                            submission.courseMaterialId
                                                        );
                                                        value.submissions.push(
                                                            submission
                                                        );
                                                    } else {
                                                        let value: Grading = {
                                                            courseCode:
                                                                currAssignment.courseCode,
                                                            courseName:
                                                                currAssignment.courseName,
                                                            title:
                                                                currAssignment.title,
                                                            content:
                                                                currAssignment.content,
                                                            submissions: [
                                                                submission,
                                                            ],
                                                        };
                                                        this.submissionCourseMap.set(
                                                            submission.courseMaterialId,
                                                            value
                                                        );
                                                    }
                                                }
                                            );
                                            this.groupedSubmissions = Array.from(
                                                this.submissionCourseMap.values()
                                            );
                                            console.log(
                                                this.submissions,
                                                this.submissionCourseMap
                                            );
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
