export interface CourseMaterial {
    id?: number;
    courseId?: number;
    courseCode?: string;
    courseName?: string;
    title?: string;
    content?: string;
    isAssignment?: boolean;
    submitted?: boolean;
}
