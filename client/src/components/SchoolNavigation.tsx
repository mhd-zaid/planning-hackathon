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
    <aside className="w-64 h-screen ">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-center mb-5">Ecole</h1>
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
        </div>
        <div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="w-full text-start p-2 rounded-lg bg-gray-800 text-white"
              >
                Administration
              </button>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
