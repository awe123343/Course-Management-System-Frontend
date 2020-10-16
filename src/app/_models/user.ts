import { Role } from './role';
import { Course } from './course';

export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    role?: Role;
    token?: string;
    courses?: Course[];
}
