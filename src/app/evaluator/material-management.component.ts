import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { AccountService } from '@app/_services/account.service';
import { CourseService } from '@app/_services/course.service';
import { CourseMaterialService } from '@app/_services/course-material.service';
import { TableColumn } from '@app/_models/tableCol';
import { Course } from '@app/_models/course';
import { CourseMaterial } from '@app/_models/course-material';
import { Option } from '@app/_models/option';
import { User } from '@app/_models/user';
import { Role } from '@app/_models/role';

@Component({
    selector: 'app-material-management',
    templateUrl: './material-management.component.html',
    styleUrls: ['./material-management.component.css'],
})
export class MaterialManagementComponent implements OnInit {
    user: User;
    cols: TableColumn[];
    materials: CourseMaterial[];
    material: CourseMaterial;
    selectedCourseMaterials: CourseMaterial[];
    displayDialog: boolean;
    addEditForm: FormGroup;
    inEditMode: boolean;
    courses: Course[];
    types: Option[];

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private courseService: CourseService,
        private courseMaterialService: CourseMaterialService,
        private messageService: MessageService
    ) {
        this.accountService.user.subscribe((x) => (this.user = x));
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'courseCode', header: 'Course Code' },
            { field: 'courseName', header: 'Course Name' },
            { field: 'title', header: 'Title' },
            { field: 'isAssignment', header: 'Type' },
        ];

        this.types = [
            { label: 'Assignment', value: true },
            { label: 'Material', value: false },
        ];

        this.addEditForm = this.formBuilder.group({
            courseId: ['', Validators.required],
            title: ['', Validators.required],
            content: [''],
            isAssignment: ['', Validators.required],
        });

        this.fetchCourseMaterials();
    }

    get f() {
        return this.addEditForm.controls;
    }

    fetchCourseMaterials() {
        this.courseMaterialService
            .getByEvaluator(this.user.id)
            .pipe(first())
            .subscribe({
                next: (materials) => {
                    this.materials = materials;

                    this.courseService
                        .getAll()
                        .pipe(first())
                        .subscribe({
                            next: (courses) => {
                                this.courses = courses.filter(
                                    (c) => c.evaluatorId === this.user.id
                                );

                                this.materials.forEach((cm) => {
                                    let currCourse: Course = this.courses.find(
                                        (c) => c.id === cm.courseId
                                    );
                                    cm.courseCode = currCourse.courseCode;
                                    cm.courseName = currCourse.courseName;
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

    addEditCourseMaterial(materialForEdit: CourseMaterial) {
        console.log('Course material to update: ', materialForEdit);
        this.addEditForm.reset();

        if (materialForEdit) {
            this.f.title.setValue(materialForEdit.title);
            // this.f.content.setValue(materialForEdit.content);
            this.f.isAssignment.setValue(materialForEdit.isAssignment);
            this.f.courseId.setValue(
                this.courses.find((c) => c.id === materialForEdit.courseId)
            );

            this.material = { ...materialForEdit };
            this.inEditMode = true;
        } else {
            this.material = {};
            this.material.isAssignment = true;
            this.f.isAssignment.setValue(true);
            this.inEditMode = false;
        }

        this.displayDialog = true;
    }

    onFormSubmit() {
        this.material.title = this.f.title.value;
        // this.material.content = this.f.content.value;
        this.material.isAssignment = this.f.isAssignment.value;
        this.material.courseId = this.f.courseId.value.id;

        console.log(this.f.isAssignment.value);
        console.log(this.material.content, this.f.content.value);

        if (this.inEditMode) {
            let materialIndexInAllMaterials = this.materials.findIndex(
                (cm) => cm.id === this.material.id
            );
            this.materials[materialIndexInAllMaterials] = this.material;

            this.courseMaterialService
                .update(this.material.id, this.material)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Update successfully',
                            detail: `Successfully updated info for ${this.material.title}`,
                        });

                        this.fetchCourseMaterials();
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
            this.materials.push(this.material);
            this.courseMaterialService
                .create(this.material)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Registration successful',
                            detail: `${this.material.title} created`,
                        });

                        this.fetchCourseMaterials();
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
        this.displayDialog = false;
        this.material = null;
    }
}
