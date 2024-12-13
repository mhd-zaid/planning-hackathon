import { createContext, useContext, useEffect, useState } from "react";
import { getBranches } from "../api/getBranches";
import { Filliere } from "../types/filliere.interface";
import { SchoolDays } from "../types/school-days.interface";
import { User } from "../types/user.interface";
import { getSchoolDaysByClass } from "../api/getSchoolDaysByClass";
import getUsers from "../api/getUsers";
import { getClassrooms } from "../api/getClassrooms";
import { Classrooms } from "../types/classrooms.interface";
import { Classes } from "../types/classes.interface";
import { SubjectClasses } from "../types/subject-classes.interface";
import { Subject } from "../types/subject.interface";
import { RoleUser } from "../types/role-user.enum";
import { getWorkHoursByTeacher } from "../api/getWorkHoursByTeacher";
import { Workhour } from "../types/work-hour.interface";
import { getAvailabilities } from "../api/getAvailabilities";
import { avaibilities } from "../types/avaibilities.interface";
import { getWorkHoursByStudent } from "../api/getWorkHoursByStudent";

interface DataContextType {
  fillieres: Filliere[];
  schoolDays: SchoolDays[];
  users: User[];
  classrooms: Classrooms[];
  classes: Classes[];
  subjectClasses: SubjectClasses[];
  subjects: Subject[];
  teachers: User[];
  workHours: Workhour[];
  fetchBranches: () => void;
  fetchSchoolDays: (idClass: string) => void;
  fetchUsers: () => void;
  fetchWorkHours: (idTeacher: string) => void;
  availabilities: avaibilities[];
  fetchAvailabilities: (idTeacher: string) => void;
  studentWorkHours: Workhour[];
  fetchStudentWorkHours: (idClass: string) => void;
}

const DataContext = createContext<DataContextType>({
  fillieres: [],
  schoolDays: [],
  users: [],
  classrooms: [],
  classes: [],
  subjectClasses: [],
  subjects: [],
  teachers: [],
  workHours: [],
  availabilities: [],
  studentWorkHours: [],
  fetchBranches: () => {},
  fetchSchoolDays: () => {},
  fetchUsers: () => {},
  fetchWorkHours: () => {},
  fetchAvailabilities: () => {},
  fetchStudentWorkHours: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [fillieres, setFillieres] = useState<Filliere[]>([]);
  const [schoolDays, setSchoolDays] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classrooms[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [subjectClasses, setSubjectClasses] = useState<SubjectClasses[]>([]);
  const [subjects, setSubject] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [workHours, setWorkHours] = useState<Workhour[]>([]);
  const [studentWorkHours, setStudentWorkHours] = useState<Workhour[]>([]);
  const [availabilities, setAvailabilities] = useState<avaibilities[]>([]);

  const fetchBranches = async () => {
    const fillieres = await getBranches();
    const classes = fillieres.flatMap((filliere) => filliere.classes);
    const subjectClasses = classes.flatMap((classe) => classe.subjectClasses);
    const subjects = subjectClasses.map((subjectClass) => subjectClass.subject);

    setSubject(subjects);
    setFillieres(fillieres);
    setSubjectClasses(subjectClasses);
    setClasses(classes);
  };

  const fetchSchoolDays = async (idClass: string) => {
    const schoolDays = await getSchoolDaysByClass(idClass);
    setSchoolDays(schoolDays);
  };

  const fetchUsers = async () => {
    const users = await getUsers();
    const teachers = users
      .map((user) => (user.role === RoleUser.professor ? user : null))
      .filter((teacher) => teacher !== null);
    setTeachers(teachers);
    setUsers(users);
  };

  const fetchClassrooms = async () => {
    const classrooms = await getClassrooms();
    setClassrooms(classrooms);
  };

  const fetchWorkHours = async (idUser: string) => {
    const workHours = await getWorkHoursByTeacher(idUser);
    setWorkHours(workHours);
  };

  const fetchStudentWorkHours = async (idClass: string) => {
    const studentWorkHours = await getWorkHoursByStudent(idClass);
    setStudentWorkHours(studentWorkHours);
  };

  const fetchAvailabilities = async (idTeacher: string) => {
    const avaibilities = await getAvailabilities(idTeacher);
    setAvailabilities(avaibilities);
  };

  const value = {
    fillieres,
    schoolDays,
    users,
    classrooms,
    classes,
    subjectClasses,
    subjects,
    teachers,
    workHours,
    availabilities,
    studentWorkHours,
    fetchBranches,
    fetchSchoolDays,
    fetchUsers,
    fetchClassrooms,
    fetchWorkHours,
    fetchAvailabilities,
    fetchStudentWorkHours,
  };

  useEffect(() => {
    if (!fillieres.length) fetchBranches();
    if (!users.length) fetchUsers();
    if (!classrooms.length) fetchClassrooms();
  }, []);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
