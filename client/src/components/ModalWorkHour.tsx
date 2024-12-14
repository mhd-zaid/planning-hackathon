import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { Classes } from "@/utils/types/classes.interface";
import { SubjectClasses } from "@/utils/types/subject-classes.interface";
import { Teacher } from "@/utils/types/teacher.interface";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { uuidv4 } from "uuidv7";

type ModalWorkHourProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  eventWorkHour: DateClickArg | undefined;
};

export default function ModalWorkHour({
  showModal,
  setShowModal,
  eventWorkHour,
}: ModalWorkHourProps) {
  const { classes, subjectClasses, teachers } = useDataContext();
  const { workHourEvent, setWorkhourEvent, selectedTeacherId } =
    useCalendarContext();

  const [selectedClasse, setSelectedClasse] = useState<Classes | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [filteredClassesByTeacher, setFilteredClassesByTeacher] = useState<
    Classes[]
  >([]);
  const [filteredSubjectByTeacher, setFilteredSubjectByTeacher] = useState<
    SubjectClasses[]
  >([]);
  const [selectedSubjectClasseId, setSelectedSubjectClasseId] =
    useState<string>("");

  const onClose = () => {
    setShowModal(false);
    setSelectedClasse(null);
    setSelectedTeacher(null);
    setSelectedSubjectClasseId("");
  };

  const formatEndDante = (dateWorkHour: string) => {
    const beginDate = new Date(dateWorkHour.split("+")[0] + "Z");
    beginDate.setHours(beginDate.getHours() + 1);
    return beginDate.toISOString().split(".")[0];
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventWorkHour) {
      alert("Veuillez selectionner une date");
      return;
    }

    if (!selectedClasse) {
      alert("Veuillez selectionner une classe");
      return;
    }

    if (!selectedSubjectClasseId) {
      alert("Veuillez selectionner une matière");
      return;
    }

    const body = [
      {
        subjectClassId: selectedSubjectClasseId,
        beginDate: eventWorkHour.dateStr.split("+")[0],
        endDate: formatEndDante(eventWorkHour.dateStr),
      },
    ];

    const selectedSubject = subjectClasses.find(
      (subjectClasse) => subjectClasse.id === selectedSubjectClasseId
    );

    try {
      const resWorkHours = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/work-hours`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (resWorkHours.ok) {
        setWorkhourEvent([
          ...workHourEvent,
          {
            id: `NEW-${uuidv4()}`,
            title: `${selectedSubject?.subject.name}`,
            start: eventWorkHour.dateStr,
            end: formatEndDante(eventWorkHour.dateStr),
          },
        ]);

        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectClasse = (idClass: string) => {
    if (!idClass) return;

    setSelectedClasse(
      classes.find((classe) => classe.id === idClass) as Classes
    );
  };

  useEffect(() => {
    if (!selectedTeacherId) return;

    const teacher = teachers.find(
      (teacher) => teacher.id === selectedTeacherId
    );

    const classesByTeacher = classes.filter((classe) =>
      classe.subjectClasses.some(
        (subjectClasse) => subjectClasse.teacherId === teacher?.id
      )
    );

    setSelectedTeacher(teacher || null);

    setFilteredClassesByTeacher(classesByTeacher);
  }, [selectedTeacherId]);

  useEffect(() => {
    if (!selectedClasse || !selectedTeacher) return;

    const subjectClassesByTeacher = filteredClassesByTeacher.map((classe) => {
      return classe.subjectClasses.find(
        (subjectClasse) => subjectClasse.teacherId === selectedTeacher?.id
      ) as SubjectClasses;
    });

    setFilteredSubjectByTeacher(subjectClassesByTeacher);
  }, [selectedClasse, selectedTeacher]);

  return (
    <div
      tabIndex={-1}
      className={`${
        showModal ? "" : "hidden"
      } flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <form onSubmit={submit}>
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex flex-col gap-5 items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900 self-start">
                Ajouter une heure de cours pour monsieur{" "}
                {selectedTeacher?.firstname} {selectedTeacher?.lastname}
              </h3>
              <div className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="filliere"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Sélectionner une classe
                  </label>
                  <select
                    id="filliere"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={(e) => selectClasse(e.target.value)}
                  >
                    <option value={""}>Choisir une classe</option>
                    {filteredClassesByTeacher.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClasse && (
                  <div>
                    <label
                      htmlFor="filliere"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Sélectionner une matière
                    </label>
                    <select
                      id="filliere"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      onChange={(e) =>
                        setSelectedSubjectClasseId(e.target.value)
                      }
                    >
                      <option value={""}>Choisir une matière</option>
                      {filteredSubjectByTeacher.map((subjectClass) => (
                        <option key={subjectClass.id} value={subjectClass.id}>
                          {subjectClass.subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
