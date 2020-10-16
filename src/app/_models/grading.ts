import { Assignment } from "./assignment";

export interface Grading {
    courseCode: string;
    courseName: string;
    title: string;
    content: string;
    submissions: Assignment[];
}
