import { Classes } from "./classes.interface";
import { RoleUser } from "./role-user.enum";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: RoleUser;
  class: Classes;
  classId: string;
  createdAt: string;
  updatedAt: string;
}
