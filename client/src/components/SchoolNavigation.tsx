import { useCalendarContext } from "@/utils/context/calendar";
import { ChangeEvent } from "react";

enum ValueSemester {
  SEMESTER_ONE = "1",
  SEMESTER_TWO = "2",
}

export default function SchoolNavigation() {
  const { setSemesterRange } = useCalendarContext();

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
    <aside className="w-64 h-screen ">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-5">Ecole</h1>

        <ul className="space-y-2">
          <li>
            <select defaultValue={""}>
              <option value="" disabled>
                Fillière
              </option>
              <option value="iw">Ingénierie web</option>
              <option value="hack">Sécurité</option>
              <option value="market">Marketing</option>
            </select>
          </li>
          <li>
            <select defaultValue={""}>
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
            <select defaultValue={""} onChange={(e) => onChangeSemester(e)}>
              <option value="" disabled>
                Période
              </option>
              <option value="1">Semestre 1</option>
              <option value="2">Semestre 2</option>
            </select>
          </li>
        </ul>
      </div>
    </aside>
  );
}
