import { User } from './user';

export interface Course {
    id?: number;
    courseCode?: string;
    courseName?: string;
    capacity?: number;
    evaluatorId?: number;
    evaluatorName?: string;
    description?: string;
    currentStuNo?: number;
    students?: User[];
    enrollmentId?: number;
}
