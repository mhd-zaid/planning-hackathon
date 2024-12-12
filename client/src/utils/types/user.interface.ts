import { RoleUser } from "./role-user.enum";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: RoleUser;
  createdAt: string;
  updatedAt: string;
}
