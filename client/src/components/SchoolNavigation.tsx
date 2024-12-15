import { ChangeEvent, useEffect, useState } from "react";
import LogoutButton from "./Logout";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { Period } from "@/utils/types/period.interface";
import { Event } from "@/utils/types/event.interface";
import useRoleUser from "@/utils/hook/useRoleUser";
import { RoleUser } from "@/utils/types/role-user.enum";
import { Backlog } from "@/utils/types/back-log.interface";
import { Classes } from "@/utils/types/classes.interface";
import ModalGeneratePlanning from "./ModalGeneratePlanning";
import Image from "next/image";
import { toast } from "react-toastify";
import ModalUnvalabilities from "./ModalUnvalabilities";
import { ClipLoader } from "react-spinners";

export default function SchoolNavigation() {
  const { setSemesterRange } = useCalendarContext();
  const {
    fillieres,
    classes,
    teachers,
    unavailabilities,
    fetchSchoolDays,
    fetchWorkHours,
    fetchStudentWorkHours,
    fetchUnAvailabilities,
  } = useDataContext();

  const {
    events,
    selectedClassId,
    selectedFilliere,
    setSelectedClassId,
    setSelectedFilliere,
    selectedTeacherId,
    setSelectedTeacherId,
    displayedByRole,
    setDisplayedByRole,
  } = useCalendarContext();

  const { role, user } = useRoleUser();

  const [backlogs, setBacklogs] = useState<Backlog[]>([]);
  const [selectedBacklog, setSelectedBacklog] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<Classes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalUnavailability, setShowModalUnavailability] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [filteredClassesByTeacher, setFilteredClassesByTeacher] = useState<
    Classes[]
  >([]);

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

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate < end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const formatEventsToDayDate = (events: Event[], formNew?: boolean) => {
    const dates: { date: string }[] = events.flatMap((event) => {
      if (formNew && !event.id.startsWith("NEW-")) {
        return [];
      }

      if (!event.end) {
        return [
          {
            date: event.start,
          },
        ];
      } else {
        const dates = getDatesBetween(event.start, event.end);
        return dates.map((date) => ({
          date: date.toISOString().split("T")[0],
        }));
      }
    });

    return dates;
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedClassId) {
      toast.error("Veuillez choisir une classe");
      return;
    }
    if (!events.length) {
      toast.error("Veuillez choisir des dates");
      return;
    }

    const formattedEvents = formatEventsToDayDate(events, true);
    if (!formattedEvents.length) {
      toast.error("Aucunne nouvelle date à enregistrer.");
      setIsLoading(false);
      return;
    }

    const body = {
      schoolDays: formattedEvents,
    };

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/school-days/${selectedClassId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      toast.success("Les jours d'école ont été enregistrés.");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des jours d'école.");
      console.log("error", error);
    } finally {
      fetchSchoolDays(selectedClassId);
      setIsLoading(false);
    }
  };

  const getBacklog = (classId: string) => {
    const backlog = fetch(
      process.env.NEXT_PUBLIC_URL_API + `/plannings/backlog/${classId}`
    );
    return backlog.then((response) => response.json());
  };

  const classesFromFilliere = (selectedFilliereValue: string) => {
    return fillieres.find((filliere) => filliere.id === selectedFilliereValue)
      ?.classes;
  };

  const handleWorkHoursValidated = () => {
    getBacklog(selectedBacklog).then((data) => {
      setBacklogs(data);
    });
    fetchStudentWorkHours(selectedBacklog);
  };

  const updateFilterClasses = (teacherId: string) => {
    if (!teacherId) return;

    const classesByTeacher = classes.filter((classe) =>
      classe.subjectClasses.some(
        (subjectClasse) => subjectClasse.teacherId === teacherId
      )
    );

    setFilteredClassesByTeacher(classesByTeacher);
  };

  useEffect(() => {
    const classes = classesFromFilliere(selectedFilliere);
    if (classes && classes.length > 0) {
      setSelectedClassId(classes[0].id);
      setFilteredClasses(classes);
    }
  }, [selectedFilliere]);

  useEffect(() => {
    if (!selectedBacklog) {
      setBacklogs([]);
      return;
    }
    getBacklog(selectedBacklog).then((data) => {
      setBacklogs(data);
    });
  }, [selectedBacklog]);

  useEffect(() => {
    if (!filteredClasses || !filteredClasses.length) return;

    setSelectedClassId(filteredClasses[0].id);
    fetchSchoolDays(filteredClasses[0].id);
  }, [filteredClasses]);

  useEffect(() => {
    if (selectedTeacherId || !teachers[0]?.id) return;

    setSelectedTeacherId(teachers[0].id);
    fetchWorkHours(teachers[0].id);
    updateFilterClasses(teachers[0].id);
    fetchUnAvailabilities(teachers[0].id);
  }, [teachers]);

  if (!role) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="h-screen p-3 shadow-lg shadow-first space-y-2 w-72 dark:bg-gray-50 dark:text-gray-800 border-r border-second flex flex-col justify-between">
      <div>
        <div className="flex items-center p-2 space-x-4">
          <Image
            width="50"
            height="50"
            src="https://images.unsplash.com/photo-1733077151624-eabccd7ba381?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {user?.firstname} {user?.lastname}
            </h2>
          </div>
        </div>

        <div className="border-b border-gray-300 my-5 w-3/4 m-auto" />

        <label className="block mb-2 text-lg font-medium text-gray-900 text-center">
          Accéder au calendrier :
        </label>
        <select
          className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          onChange={(e) => setDisplayedByRole(e.target.value as RoleUser)}
        >
          <option key={RoleUser.manager} value={RoleUser.manager}>
            Responsable pédagogique
          </option>
          <option key={RoleUser.professor} value={RoleUser.professor}>
            Professeur
          </option>
          <option key={RoleUser.student} value={RoleUser.student}>
            Classe
          </option>
        </select>

        <div className="border-b border-gray-300 my-5 w-3/4 m-auto" />

        {displayedByRole === RoleUser.manager && (
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li>
              <label
                htmlFor="filliere"
                className="block mb-2 text-lg font-medium text-gray-900 text-center"
              >
                Sélectionner une filière
              </label>
              <select
                id="filliere"
                className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={(e) => setSelectedFilliere(e.target.value)}
              >
                <option value={""}>Choisir une fillière</option>
                {fillieres.map((filliere) => (
                  <option key={filliere.id} value={filliere.id}>
                    {filliere.name}
                  </option>
                ))}
              </select>

              {classes && !!selectedFilliere && (
                <form onSubmit={submitForm}>
                  <p className="block mt-6 text-lg font-medium text-gray-900 text-center">
                    Choisir une classe
                  </p>{" "}
                  <br />
                  <ul>
                    {filteredClasses?.map((classe) => (
                      <li key={classe.id}>
                        <div className="flex p-2 rounded hover:bg-gray-100">
                          <div className="flex items-center h-5">
                            <input
                              id={`input-index-${classe.name}`}
                              type="radio"
                              name="classe-radio"
                              value={classe.id}
                              checked={classe.id === selectedClassId}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-first focus:ring-blue-500"
                              onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                fetchSchoolDays(e.target.value);
                              }}
                            />
                          </div>
                          <div className="ms-2 text-sm">
                            <label
                              htmlFor={`input-index-${classe.name}`}
                              className="font-medium text-gray-900"
                            >
                              <div className="font-bold">{classe.name}</div>
                            </label>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <label
                    htmlFor="period"
                    className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center"
                  >
                    Sélectionner une période
                  </label>
                  <select
                    id="period"
                    className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    onChange={onChangeSemester}
                  >
                    <option value="">Choisir une période</option>
                    {periodFromFilliere(selectedFilliere)?.map((period) => (
                      <option key={period.id} value={period.id}>
                        Période du{" "}
                        {new Date(period.beginDate).toLocaleDateString()} au{" "}
                        {new Date(period.endDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className=" text-white text-lg w-full text-center p-2 my-5 rounded-lg bg-first"
                  >
                    {isLoading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      "Enregistrer les jours"
                    )}
                  </button>
                </form>
              )}
            </li>
          </ul>
        )}

        <ModalGeneratePlanning
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classId={selectedBacklog}
          onWorkHoursValidated={handleWorkHoursValidated}
        />

        {displayedByRole === RoleUser.professor && (
          <>
            <label className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center">
              Choisir un professeur
            </label>
            <select
              id="period"
              className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) => {
                fetchWorkHours(e.target.value);
                setSelectedTeacherId(e.target.value);
                updateFilterClasses(e.target.value);
                fetchUnAvailabilities(e.target.value);
              }}
            >
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstname} {teacher.lastname}
                </option>
              ))}
            </select>

            <label className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center">
              Jour d&apos;école par classe
            </label>
            <select
              className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) => fetchSchoolDays(e.target.value)}
            >
              <option value={""}>Choisir une classe</option>
              {filteredClassesByTeacher?.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.name}
                </option>
              ))}
            </select>

            <ModalUnvalabilities
              showModal={showModalUnavailability}
              setShowModal={setShowModalUnavailability}
              unavailabilities={unavailabilities}
              teacher={teachers.find(
                (teacher) => teacher.id === selectedTeacherId
              )}
            />
          </>
        )}

        {displayedByRole === RoleUser.student && (
          <div>
            <div>
              <label className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center">
                Choisir une classe
              </label>
              <select
                id="classe"
                className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={(e) => {
                  setSelectedBacklog(e.target.value);
                  fetchStudentWorkHours(e.target.value);
                }}
              >
                <option value={""}>Choisir une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedBacklog && (
              <>
                <a
                  rel="noopener noreferrer"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-5 flex items-center p-2 space-x-3 rounded-md bg-first hover:bg-second cursor-pointer"
                >
                  <span className="text-lg text-white">
                    Générer un planning
                  </span>
                </a>
                <h3 className="mt-4 font-bold">Récapitulatif des heures</h3>
                {backlogs.map((backlog, index) => (
                  <div
                    key={index}
                    className="flex flex-col text-sm space-y-1 pt-3"
                  >
                    <span>
                      <b>{backlog.subjectName}</b>
                    </span>
                    <span>Quota d&apos;heures : {backlog.subjectQuota}</span>
                    <span>
                      Heures planifiées : {backlog.subjectHoursScheduled}
                    </span>
                    <span>
                      Heures restantes : {backlog.subjectRemainingHours}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <div>
        {displayedByRole === RoleUser.professor &&
          unavailabilities.length > 0 && (
            <button
              onClick={() => setShowModalUnavailability(true)}
              className="w-full mb-5 flex text-lg text-white items-center p-2 space-x-3 rounded-md bg-first hover:bg-second cursor-pointer"
            >
              Absence de l&apos;intervenant
            </button>
          )}

        <LogoutButton />
      </div>
    </div>
  );
}
