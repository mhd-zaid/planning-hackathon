"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { ChangeEvent } from "react";
import LogoutButton from "./Logout";
import useRoleUser from "@/utils/hook/useRoleUser";

enum ValueSemester {
  SEMESTER_ONE = "1",
  SEMESTER_TWO = "2",
}

export default function IntervenantNavigation() {
  const [user, setUser] = useState();
  const { setSemesterRange } = useCalendarContext();

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
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li>Matière : </li>
            <li className="dark:bg-gray-100 dark:text-gray-900">
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                defaultValue={""}
              >
                <option value="" disabled>
                  Fillière
                </option>
                <option value="iw">Ingénierie web</option>
                <option value="hack">Sécurité</option>
                <option value="market">Marketing</option>
              </select>
            </li>
            <li>
            <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  defaultValue={""}
                >
                  <option value="" disabled>
                    Classe
                  </option>
                  <option value="iw">Classe 4A</option>
                  <option value="hack">Classe 4B</option>
                  <option value="market">Classe 5A</option>
                  <option value="market">Classe 5B</option>
                </select>
            </li>
            <li>
            <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  defaultValue={""}
                  onChange={(e) => onChangeSemester(e)}
                >
                  <option value="" disabled>
                    Période
                  </option>
                  <option value="1">Semestre 1</option>
                  <option value="2">Semestre 2</option>
                </select>
            </li>
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
