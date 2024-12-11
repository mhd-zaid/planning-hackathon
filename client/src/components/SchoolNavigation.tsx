
import Logout from "./Logout";
// import { useCalendarContext } from "@/utils/context/calendar";
// import { ChangeEvent, useState } from "react";
import { ChangeEvent, useState } from "react";
import FormInputSelect from "./InputSelect";
import LogoutButton from "./Logout";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { Period } from "@/utils/types/period.interface";

// enum ValueSemester {
//   SEMESTER_ONE = "1",
//   SEMESTER_TWO = "2",
// }

export default function SchoolNavigation() {
  const { setSemesterRange } = useCalendarContext();

  const { fillieres } = useDataContext();

  const {setShowAdmin, showAdmin} = useCalendarContext();

  const [selectedFilliere, setSelectedFilliere] = useState<string>("");

  const classesFromFilliere = (selectedFilliereValue: string) =>
    fillieres.find((filliere) => filliere.id === selectedFilliereValue)
      ?.classes;

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

    const period = periodFromFilliere(selectedFilliere)?.find(
      (period) => period.id === idPeriod
    );

    if (!period) return;

    setSemesterRange({
      start: new Date(period?.beginDate).toISOString(),
      end: new Date(period.endDate).toISOString(),
    });
  };

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
          <>
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
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
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
          </>
        )}
          
        </div>
        <div>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full text-start p-2 rounded-lg bg-gray-800 text-white">Administration</button></li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
