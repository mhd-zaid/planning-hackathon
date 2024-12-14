import { SubjectClasses } from "./subject-classes.interface";

export interface Unavailabilities {
  id?: string;
  date: string;
  userId: string;
  subjectClassId: string;
  subjectClass: SubjectClasses;
  updatedAt: string;
  createdAt: string;
}
