"use client";

import Logout from "./Logout";
import { useEffect, useState } from "react";
import { useRouter } from 'vue-router';
import { redirect } from 'next/navigation'
import { useCalendarContext } from "@/utils/context/calendar";
import { ChangeEvent } from "react";
import LogoutButton from "./Logout";

enum ValueSemester {
  SEMESTER_ONE = "1",
  SEMESTER_TWO = "2",
}

export default function IntervenantNavigation() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const { setSemesterRange } = useCalendarContext();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      redirect('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [router]);

  if (!user) {
    return <p>Chargement...</p>;
  };

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

  return (
    <aside className="w-64 h-screen border-r border-second">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-center mb-5">Intervenant</h1>
          <p>Nom : {user.firstname}</p><br/>
          <p>Matières :  </p><br />
          <p>Taux horraires : </p><br />
          <ul className="space-y-2 flex flex-col">
            <li>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " defaultValue={""}>
                <option value="" disabled>
                  Fillière
                </option>
                <option value="iw">Ingénierie web</option>
                <option value="hack">Sécurité</option>
                <option value="market">Marketing</option>
              </select>
            </li>
            <li>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " defaultValue={""}>
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
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " defaultValue={""} onChange={(e) => onChangeSemester(e)}>
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
          <ul className="space-y-2">
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}