"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { ChangeEvent } from "react";
import LogoutButton from "./Logout";
import useRoleUser from "@/utils/hook/useRoleUser";
import { User } from "@/utils/types/user.interface";
import { Classes } from "@/utils/types/classes.interface";

enum ValueSemester {
  SEMESTER_ONE = "1",
  SEMESTER_TWO = "2",
}

export default function IntervenantNavigation() {

  const {classes, fetchSchoolDays} = useDataContext();
  // const [user, setUser] = useState();
  const { setSemesterRange, selectedClassId, setSelectedClassId } = useCalendarContext();

  const { role } = useRoleUser()

  const semesterOne = {
    start: "2024-01-01",
    end: "2024-06-30",
  };

  const semesterTwo = {
    start: "2024-07-01",
    end: "2024-12-31",
  };

  const onChangeSemester = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ValueSemester;
    switch (value) {
      case ValueSemester.SEMESTER_ONE:
        setSemesterRange(semesterOne);
        break;
      case ValueSemester.SEMESTER_TWO:
        setSemesterRange(semesterTwo);
        break;
      default:
        break;
    }
  };

  const userstr = localStorage.getItem("loggedInUser");
  const user : User = userstr && JSON.parse(userstr);

  const teacherClasses = classes.flatMap((classe) => classe.subjectClasses.map((subjectClasse) => {
    if(subjectClasse.teacher.id === user.id){
      return classe
    } else {
      return null
    }
  })).filter((teacher) => teacher) as Classes[]

  useEffect(() => {
    if (!!selectedClassId) {
      fetchSchoolDays(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if(!!selectedClassId){
      return
    }
    if(teacherClasses && teacherClasses.length>0){
      setSelectedClassId(teacherClasses[0].id)
    }
  }, [teacherClasses]);

  if (!role) {
    return <p>Chargement...</p>;
  }

  console.log(user);

  return (
    <div className="h-screen p-3 space-y-2 w-72 dark:bg-gray-50 dark:text-gray-800 border-r border-second flex flex-col justify-between">
      <div>
        <div className="flex items-center p-2 space-x-4">
          <img src="https://source.unsplash.com/100x100/?portrait" alt="" className="w-12 h-12 rounded-full dark:bg-gray-500" />
          <div>
            <h2 className="text-lg font-semibold"></h2>
          </div>
        </div>
        <ul>
          {teacherClasses?.map((classe: Classes) => (
            <li key={classe.id}>
              <div className="flex p-2 rounded hover:bg-gray-100">
                <div className="flex items-center h-5">
                  <input
                    id={`input-index-${classe.name}`}
                    type="radio"
                    name="classe-radio"
                    value={classe.id}
                    checked={selectedClassId === classe.id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                    }}
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor={`input-index-${classe.name}`}
                    className="font-medium text-gray-900"
                  >
                    <div className="font-bold">{classe.name}</div>
                    {classe.restHour && (
                      <p className="text-xs font-normal text-gray-500">
                        Il reste {classe.restHour} heures à placé
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <div>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
