import { Role } from "./role";

export interface User {
	id?: number;
	firstName?: string;
	lastName?: string;
	username?: string;
    password?: string;
	role?: Role;
	token?: string;
}
