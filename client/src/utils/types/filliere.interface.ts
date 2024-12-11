import { Classes } from "./classes.interface";
import { Subject } from "./subject.interface";

export interface Filliere {
  id: string;
  name: string;
  nbHoursQuota: number;
  classes: Classes[];
  subjects: Subject[];
  createdAt: string;
  updatedAt: string;
}
