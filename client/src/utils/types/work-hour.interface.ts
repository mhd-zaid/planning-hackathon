import { Subject } from "./subject.interface";

export interface Workhour {
  id: string;
  beginDate: string;
  endDate: string;
  subjectClass: {
    id: string;
    subject: Subject;
  };
}
