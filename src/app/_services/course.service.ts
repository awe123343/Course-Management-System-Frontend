import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Course } from '@app/_models/course';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CourseService {
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<Course[]>(`${environment.apiUrl}/courses`);
    }

    getAllWithEnrollment() {
        return this.http.get<Course[]>(
            `${environment.apiUrl}/courses/enrollinfo`
        );
    }

    getAllForDisplay() {
        return this.http.get<Course[]>(`${environment.apiUrl}/courses/info`);
    }

    getCourseForEvaluator(id: number) {
        return this.http.get<Course[]>(
            `${environment.apiUrl}/courses/evaluator/${id}`
        );
    }

    getCourseByStudent(id: number) {
        return this.http.get<Course[]>(
            `${environment.apiUrl}/courses/enrolllist/${id}`
        );
    }

    getById(id: number) {
        return this.http.get<Course>(`${environment.apiUrl}/courses/${id}`);
    }

    create(course: Course) {
        return this.http.post(`${environment.apiUrl}/courses/create`, course);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/courses/${id}`, params);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/courses/${id}`);
    }

    enroll(stuId: number, courseId: number) {
        let body = {
            studentId: stuId,
            courseId: courseId,
        };
        return this.http.post(`${environment.apiUrl}/courses/enroll`, body);
    }

    deEnroll(id: number) {
        return this.http.get(`${environment.apiUrl}/courses/deenroll/${id}`);
    }
}
