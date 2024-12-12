import { useDataContext } from "@/utils/context/data";
import { Classes } from "@/utils/types/classes.interface";
import { RoleUser } from "@/utils/types/role-user.enum";
import { SubjectClasses } from "@/utils/types/subject-classes.interface";
import { Subject } from "@/utils/types/subject.interface";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";

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
  const { users, classrooms, classes, subjectClasses } = useDataContext();
  const [selectedIntervenant, setSelectedIntervenant] = useState<string>("");
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectClasseId, setSelectedSubjectClasseId] =
    useState<string>("");

  const [selectedClasse, setSelectedClasse] = useState<Classes>();
  const [selectedSubjectClasse, setSelectedSubjectClasse] =
    useState<SubjectClasses>();

  const intervenants = users
    .map((user) => (user.role === RoleUser.professor ? user : null))
    .filter((user) => user !== null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventWorkHour) {
      alert("Veuillez selectionner une date");
      return;
    }

    if (!selectedIntervenant) {
      alert("Veuillez selectionner un intervenant");
      return;
    }

    if (!selectedClassroom) {
      alert("Veuillez selectionner une salle de classe");
      return;
    }

    if (!selectedClassId) {
      alert("Veuillez selectionner une classe");
      return;
    }

    // const body = {
    //   workhours: [
    //     {
    //       subjectClassId: selectedClass,
    //       beginDate: eventWorkHour.dateStr.split("+")[0],
    //       endDate: () => {
    //         const date = new Date(eventWorkHour.dateStr.split("+")[0]);
    //         date.setHours(date.getHours() + 1);
    //         return date.toISOString();
    //       },
    //     },
    //   ],
    // };

    // console.log(body);

    // try {
    //   await fetch(`${process.env.NEXT_PUBLIC_URL_API}/work-hours`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(body),
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    if (selectedClassId) {
      // const class
      setSelectedClasse(
        classes.find((classe) => classe.id === selectedClassId)
      );
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedSubjectClasseId) {
      setSelectedSubjectClasse(
        subjectClasses.find(
          (subjectClass) => subjectClass.id === selectedSubjectClasseId
        )
      );
    }
  }, [selectedSubjectClasseId]);

  return (
    <div
      tabIndex={-1}
      className={`${
        showModal ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <form onSubmit={submit}>
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex flex-col gap-5 items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900 self-start">
                Ajouter une heure de cours
              </h3>
              <div className="flex flex-col gap-5">
                {/* <div>
                  <label
                    htmlFor="filliere"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Sélectionner un intervenant
                  </label>
                  <select
                    id="filliere"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={(e) => setSelectedIntervenant(e.target.value)}
                  >
                    <option value={""}>Choisir une intervenant</option>
                    {intervenants.map((intervenant) => (
                      <option key={intervenant.id} value={intervenant.id}>
                        {intervenant.firstname} - {intervenant.lastname}
                      </option>
                    ))}
                  </select>
                </div> */}
                {/* <div>
                  <label
                    htmlFor="filliere"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Sélectionner une salle de classe
                  </label>
                  <select
                    id="filliere"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                  >
                    <option value={""}>Choisir une salle de classe</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </div> */}
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
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    <option value={""}>Choisir une classe</option>
                    {classes.map((classe) => (
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
                      {selectedClasse.subjectClasses.map((subjectClass) => (
                        <option key={subjectClass.id} value={subjectClass.id}>
                          {subjectClass.subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedSubjectClasse && (
                  <p>
                    Professeur : {selectedSubjectClasse.teacher.firstName}{" "}
                    {selectedSubjectClasse.teacher.lastName}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <span className="sr-only">Close modal</span>
              </button>
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
                onClick={() => setShowModal(false)}
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
