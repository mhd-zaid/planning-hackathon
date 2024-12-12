"use client";

import { ChangeEvent, useEffect, useState } from "react";
import LogoutButton from "./Logout";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { Period } from "@/utils/types/period.interface";
import useRoleUser from "@/utils/hook/useRoleUser";

export default function SchoolNavigation() {
  const { setSemesterRange } = useCalendarContext();

  const { fillieres } = useDataContext();

  const {role} = useRoleUser()

  const {
    setShowAdmin,
    showAdmin,
    events,
    selectedClassId,
    selectedFilliere,
    setSelectedClassId,
    setSelectedFilliere,
  } = useCalendarContext();

  const classesFromFilliere = (selectedFilliereValue: string) => {
    return fillieres.find((filliere) => filliere.id === selectedFilliereValue)
      ?.classes;
  };

  const periodFromFilliere = (selectedFilliereValue: string) => {
    const periods = fillieres
      .find((filliere) => filliere.id === selectedFilliereValue)
      ?.classes.flatMap((classe) =>
        classe.subjectClasses.map((subjectClass) => subjectClass.period)
      )
      .filter((period) => period);

    return periods?.reduce((acc: Period[], current: Period) => {
      const idPeriod = acc.map((period) => period.id);

      if (!idPeriod.includes(current.id)) {
        acc.push(current);
      }
      return acc;
    }, [] as Period[]);
  };

  const onChangeSemester = (e: ChangeEvent<HTMLSelectElement>) => {
    const idPeriod = e.target.value;

    if (!idPeriod) {
      setSemesterRange(null);
      return;
    }

    const period = periodFromFilliere(selectedFilliere)?.find(
      (period) => period.id === idPeriod
    );

    if (!period) return;

    setSemesterRange({
      start: new Date(period?.beginDate).toISOString(),
      end: new Date(period.endDate).toISOString(),
    });
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClassId) {
      alert("Veuillez choisir une classe");
      return;
    }
    if (!events.length) {
      alert("Veuillez choisir des dates");
      return;
    }

    const getDatesBetween = (startDate: string, endDate: string) => {
      const dates = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    };

    const formattedEvents: { date: string }[] = events.map((event) => {
      if (new Date(event.start).getDay === new Date(event.end).getDay) {
        return {
          date: event.start,
        };
      } else {
        const dates = getDatesBetween(event.start, event.end);
        console.log("dates", dates);
        return {
          date: "",
        };
        // Ici je dois récupérer tout les jours entre le jours de début inclus et le jours de fin inclus
        // const dates = getDatesBetween(event.start, event.end);
        // return dates.map((date) => ({
        //   start: date.toISOString(),
        //   end: date.toISOString(),
        // }));
      }
    });

    formattedEvents.forEach(async (event) => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/school-days/${selectedClassId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: event.date,
            }),
          }
        );
      } catch (error) {
        console.log("error", error);
      }
    });
  };

  useEffect(() => {
    const classes = classesFromFilliere(selectedFilliere);
    if (classes && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [selectedFilliere]);

  if (!role) {
    return <p>Chargement...</p>;
  }

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
            <li className="dark:bg-gray-100 dark:text-gray-900">
              
            </li>
            <li>
            <label
                htmlFor="filliere"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Sélectionner une filière
              </label>
              <select
                id="filliere"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={(e) => setSelectedFilliere(e.target.value)}
              >
                <option value={""}>Choisir une fillière</option>
                {fillieres.map((filliere) => (
                  <option key={filliere.id} value={filliere.id}>
                    {filliere.name}
                  </option>
                ))}
              </select>

              {classesFromFilliere(selectedFilliere) && (
                <form onSubmit={submitForm}>
                  <p className="block my-2 text-sm font-medium text-gray-900 ">
                    Choisir une classe
                  </p>
                  <ul>
                    {classesFromFilliere(selectedFilliere)?.map((classe) => (
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
                              onChange={(e) => setSelectedClassId(e.target.value)}
                            />
                          </div>
                          <div className="ms-2 text-sm">
                            <label
                              htmlFor={`input-index-${classe.name}`}
                              className="font-medium text-gray-900"
                            >
                              <div className="font-bold">{classe.name}</div>
                              <p className="text-xs font-normal text-gray-500">
                                Il reste 20 heures à placé
                              </p>
                            </label>
                          </div>
                        </div>
                        <div className="ms-2 text-sm">
                          <label
                            htmlFor={`input-index-${classe.name}`}
                            className="font-medium text-gray-900"
                          >
                            <div className="font-bold">{classe.name}</div>
                            <p className="text-xs font-normal text-gray-500">
                              Il reste 20 heures à placer
                            </p>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <label
                    htmlFor="period"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Sélectionner une période
                  </label>
                  <select
                    id="period"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={onChangeSemester}
                  >
                    <option value="">Choisir une période</option>
                    {periodFromFilliere(selectedFilliere)?.map((period) => (
                      <option key={period.id} value={period.id}>
                        Période du {new Date(period.beginDate).toLocaleDateString()}{" "}
                        au {new Date(period.endDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="w-full text-center p-2 my-5 rounded-lg bg-first"
                  >
                    Enregistrer les jours
                  </button>
                </form>
              )}
            </li>
          </ul>
      </div>
      
      <div>
        <div>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <a rel="noopener noreferrer" onClick={() => setShowAdmin(!showAdmin)} className="flex items-center p-2 space-x-3 rounded-md bg-second hover:bg-second cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-white">
                <path d="M245.151,168a88,88,0,1,0,88,88A88.1,88.1,0,0,0,245.151,168Zm0,144a56,56,0,1,1,56-56A56.063,56.063,0,0,1,245.151,312Z"></path>
                <path d="M464.7,322.319l-31.77-26.153a193.081,193.081,0,0,0,0-80.332l31.77-26.153a19.941,19.941,0,0,0,4.606-25.439l-32.612-56.483a19.936,19.936,0,0,0-24.337-8.73l-38.561,14.447a192.038,192.038,0,0,0-69.54-40.192L297.49,32.713A19.936,19.936,0,0,0,277.762,16H212.54a19.937,19.937,0,0,0-19.728,16.712L186.05,73.284a192.03,192.03,0,0,0-69.54,40.192L77.945,99.027a19.937,19.937,0,0,0-24.334,8.731L21,164.245a19.94,19.94,0,0,0,4.61,25.438l31.767,26.151a193.081,193.081,0,0,0,0,80.332l-31.77,26.153A19.942,19.942,0,0,0,21,347.758l32.612,56.483a19.937,19.937,0,0,0,24.337,8.73l38.562-14.447a192.03,192.03,0,0,0,69.54,40.192l6.762,40.571A19.937,19.937,0,0,0,212.54,496h65.222a19.936,19.936,0,0,0,19.728-16.712l6.763-40.572a192.038,192.038,0,0,0,69.54-40.192l38.564,14.449a19.938,19.938,0,0,0,24.334-8.731L469.3,347.755A19.939,19.939,0,0,0,464.7,322.319Zm-50.636,57.12-48.109-18.024-7.285,7.334a159.955,159.955,0,0,1-72.625,41.973l-10,2.636L267.6,464h-44.89l-8.442-50.642-10-2.636a159.955,159.955,0,0,1-72.625-41.973l-7.285-7.334L76.241,379.439,53.8,340.562l39.629-32.624-2.7-9.973a160.9,160.9,0,0,1,0-83.93l2.7-9.972L53.8,171.439l22.446-38.878,48.109,18.024,7.285-7.334a159.955,159.955,0,0,1,72.625-41.973l10-2.636L222.706,48H267.6l8.442,50.642,10,2.636a159.955,159.955,0,0,1,72.625,41.973l7.285,7.334,48.109-18.024,22.447,38.877-39.629,32.625,2.7,9.972a160.9,160.9,0,0,1,0,83.93l-2.7,9.973,39.629,32.623Z"></path>
              </svg>
                <span className='text-lg text-white'>Administration</span>
              </a>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
