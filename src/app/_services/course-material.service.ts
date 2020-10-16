import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CourseMaterial } from '@app/_models/course-material';
import { Assignment } from '@app/_models/assignment';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CourseMaterialService {
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<CourseMaterial[]>(
            `${environment.apiUrl}/coursematerials`
        );
    }

    getByEvaluator(id: number) {
        return this.http.get<CourseMaterial[]>(
            `${environment.apiUrl}/coursematerials/evaluator/${id}`
        );
    }

    getByStudent(id: number) {
        return this.http.get<CourseMaterial[]>(
            `${environment.apiUrl}/coursematerials/student/${id}`
        );
    }

    getAssignmentByEvaluator(id: number) {
        return this.http.get<Assignment[]>(
            `${environment.apiUrl}/coursematerials/evaassignment/${id}`
        );
    }

    getAssignmentByStudent(id: number) {
        return this.http.get<Assignment[]>(
            `${environment.apiUrl}/coursematerials/stuassignment/${id}`
        );
    }

    getByCourse(id: number) {
        return this.http.get<CourseMaterial[]>(
            `${environment.apiUrl}/coursematerials/course/${id}`
        );
    }

    getAssignmentByStudentCourse(stuId: number, courseId: number) {
        let body = {
            stuId: stuId,
            courseId: courseId,
        };
        return this.http.post<Assignment[]>(
            `${environment.apiUrl}/coursematerials/assignmentstucourse`,
            body
        );
    }

    getById(id: number) {
        return this.http.get<CourseMaterial>(
            `${environment.apiUrl}/coursematerials/${id}`
        );
    }

    create(cm: CourseMaterial) {
        return this.http.post(
            `${environment.apiUrl}/coursematerials/create`,
            cm
        );
    }

    update(id, params) {
        return this.http.put(
            `${environment.apiUrl}/coursematerials/${id}`,
            params
        );
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/coursematerials/${id}`);
    }

    submitAssignment(assignment: Assignment) {
        return this.http.post(
            `${environment.apiUrl}/coursematerials/submitassignment`,
            assignment
        );
    }

    updateAssignment(id: number, params) {
        return this.http.put(
            `${environment.apiUrl}/coursematerials/updateassignment/${id}`,
            params
        );
    }

    gradeAssignment(id: number, grade: number) {
        let body = {
            id: id,
            grade: grade,
        };
        return this.http.post(
            `${environment.apiUrl}/coursematerials/grading`,
            body
        );
    }
}
