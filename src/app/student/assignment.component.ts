import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Course } from '@app/_models/course';
import { User } from '@app/_models/user';
import { CourseMaterial } from '@app/_models/course-material';
import { Assignment } from '@app/_models/assignment';
import { TableColumn } from '@app/_models/tableCol';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';
import { CourseMaterialService } from '@app/_services/course-material.service';

@Component({
    selector: 'app-assignment',
    templateUrl: './assignment.component.html',
    styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    materials: CourseMaterial[];
    courses: Course[];
    assignments: CourseMaterial[];
    submissions: Assignment[];
    displayDialog: boolean;
    courseMaterialToView: CourseMaterial;
    selectedAssignment: Assignment;

    constructor(
        private courseService: CourseService,
        private courseMaterialService: CourseMaterialService,
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
            { field: 'title', header: 'Title' },
        ];

        this.fetchStudentCourseMaterials();
    }

    viewCourseMaterial(materialToView: CourseMaterial) {
        this.courseMaterialToView = materialToView;
        if (this.courseMaterialToView.isAssignment) {
            this.selectedAssignment = materialToView.submitted
                ? this.submissions.find(
                      (s) => s.courseMaterialId === this.courseMaterialToView.id
                  )
                : {};
        }
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
        this.courseMaterialToView = null;
        this.selectedAssignment = null;
    }

    getDialogHeader(): string {
        let header: string;
        if (this.courseMaterialToView) {
            header = !this.courseMaterialToView.isAssignment
                ? 'Material Detail'
                : 'Assignment Detail';
        } else {
            header = 'Detail';
        }
        return header;
    }

    getAssignmentGrade(material: CourseMaterial) {
        return material.submitted
            ? this.submissions.find((s) => s.courseMaterialId === material.id)
                  .grades
            : null;
    }

    submitAssignment() {
        this.selectedAssignment.studentId = this.user.id;
        this.selectedAssignment.courseMaterialId = this.courseMaterialToView.id;

        console.log(this.selectedAssignment);

        this.confirmationService.confirm({
            message: `Are you sure you want to ${
                this.courseMaterialToView.submitted ? 'update' : 'submit'
            }?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.courseMaterialToView.submitted) {
                    this.courseMaterialService
                        .updateAssignment(
                            this.selectedAssignment.id,
                            this.selectedAssignment
                        )
                        .pipe(first())
                        .subscribe({
                            next: () => {
                                this.fetchStudentCourseMaterials();
                                this.hideDialog();
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
                } else {
                    this.courseMaterialService
                        .submitAssignment(this.selectedAssignment)
                        .pipe(first())
                        .subscribe({
                            next: () => {
                                this.fetchStudentCourseMaterials();
                                this.hideDialog();
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

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: `${this.courseMaterialToView.title} ${
                        this.courseMaterialToView.submitted
                            ? 'updated'
                            : 'submitted'
                    }`,
                    life: 3000,
                });
            },
        });
    }

    fetchStudentCourseMaterials() {
        this.courseService
            .getCourseByStudent(this.user.id)
            .pipe(first())
            .subscribe({
                next: (courses) => {
                    this.courses = courses;

                    this.courseMaterialService
                        .getByStudent(this.user.id)
                        .pipe(first())
                        .subscribe({
                            next: (courseMaterials) => {
                                let cms = courseMaterials;
                                cms.forEach((cm) => {
                                    let currCourse: Course = this.courses.find(
                                        (c) => c.id === cm.courseId
                                    );
                                    cm.courseCode = currCourse.courseCode;
                                    cm.courseName = currCourse.courseName;
                                });

                                this.materials = cms.filter(
                                    (cm) => !cm.isAssignment
                                );
                                this.assignments = cms.filter(
                                    (cm) => cm.isAssignment
                                );

                                this.courseMaterialService
                                    .getAssignmentByStudent(this.user.id)
                                    .pipe(first())
                                    .subscribe({
                                        next: (submissions) => {
                                            this.submissions = submissions;

                                            this.assignments.forEach(
                                                (assignment) => {
                                                    assignment.submitted = this.submissions
                                                        .map(
                                                            (s) =>
                                                                s.courseMaterialId
                                                        )
                                                        .includes(
                                                            assignment.id
                                                        );
                                                }
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
