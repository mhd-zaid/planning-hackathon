import { Period } from "./period.interface";
import { Subject } from "./subject.interface";
import { Teacher } from "./teacher.interface";

export interface SubjectClasses {
  id: string;
  classId: string;
  period: Period;
  subject: Subject;
  teacher: Teacher;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}
