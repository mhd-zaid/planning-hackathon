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

export default function SchoolNavigation() {
  const { setSemesterRange } = useCalendarContext();
  const {
    fillieres,
    classes,
    teachers,
    fetchSchoolDays,
    fetchWorkHours,
    fetchStudentWorkHours,
  } = useDataContext();

  const {
    setShowAdmin,
    showAdmin,
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
    if (!selectedClassId) {
      alert("Veuillez choisir une classe");
      return;
    }
    if (!events.length) {
      alert("Veuillez choisir des dates");
      return;
    }

    const body = {
      schoolDays: formatEventsToDayDate(events, true),
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
    } catch (error) {
      console.log("error", error);
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
    if (classes && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [selectedFilliere]);

  useEffect(() => {
    if (selectedTeacherId) return;

    setSelectedTeacherId(teachers[0]?.id || "");
    fetchWorkHours(teachers[0]?.id || "");
  }, [teachers]);

  if (!role) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="h-screen p-3 space-y-2 w-72 dark:bg-gray-50 dark:text-gray-800 border-r border-second flex flex-col justify-between">
      <div>
        <div className="flex items-center p-2 space-x-4">
          <img
            src="https://images.unsplash.com/photo-1733077151624-eabccd7ba381?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {user.firstname} {user.lastname}
            </h2>
          </div>
        </div>

        <div className="border-b border-gray-300 my-5 w-3/4 m-auto" />

        <label className="block mb-2 text-lg font-medium text-gray-900 text-center">
          Accéder au calendrier :
        </label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={(e) => {
                  setSelectedFilliere(e.target.value);
                }}
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
                  </p>
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
                              checked={selectedClassId === classe.id}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              onChange={(e) => {
                                fetchSchoolDays(selectedClassId);
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
                                  Il reste {classe.restHour} heures à placer
                                </p>
                              )}
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
                    className="w-full text-center p-2 my-5 rounded-lg bg-first"
                  >
                    Enregistrer les jours
                  </button>
                </form>
              )}
            </li>
          </ul>
        )}

      <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        Ouvrir la modal
      </button>
      <ModalGeneratePlanning isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

        {displayedByRole === RoleUser.professor && (
          <>
            <label className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center">
              Choisir un professeur
            </label>
            <select
              id="period"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) => fetchWorkHours(e.target.value)}
            >
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstname} {teacher.lastname}
                </option>
              ))}
            </select>
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
        <div>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <a
                rel="noopener noreferrer"
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex items-center p-2 space-x-3 rounded-md bg-second hover:bg-second cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5 fill-current dark:text-white"
                >
                  <path d="M245.151,168a88,88,0,1,0,88,88A88.1,88.1,0,0,0,245.151,168Zm0,144a56,56,0,1,1,56-56A56.063,56.063,0,0,1,245.151,312Z"></path>
                  <path d="M464.7,322.319l-31.77-26.153a193.081,193.081,0,0,0,0-80.332l31.77-26.153a19.941,19.941,0,0,0,4.606-25.439l-32.612-56.483a19.936,19.936,0,0,0-24.337-8.73l-38.561,14.447a192.038,192.038,0,0,0-69.54-40.192L297.49,32.713A19.936,19.936,0,0,0,277.762,16H212.54a19.937,19.937,0,0,0-19.728,16.712L186.05,73.284a192.03,192.03,0,0,0-69.54,40.192L77.945,99.027a19.937,19.937,0,0,0-24.334,8.731L21,164.245a19.94,19.94,0,0,0,4.61,25.438l31.767,26.151a193.081,193.081,0,0,0,0,80.332l-31.77,26.153A19.942,19.942,0,0,0,21,347.758l32.612,56.483a19.937,19.937,0,0,0,24.337,8.73l38.562-14.447a192.03,192.03,0,0,0,69.54,40.192l6.762,40.571A19.937,19.937,0,0,0,212.54,496h65.222a19.936,19.936,0,0,0,19.728-16.712l6.763-40.572a192.038,192.038,0,0,0,69.54-40.192l38.564,14.449a19.938,19.938,0,0,0,24.334-8.731L469.3,347.755A19.939,19.939,0,0,0,464.7,322.319Zm-50.636,57.12-48.109-18.024-7.285,7.334a159.955,159.955,0,0,1-72.625,41.973l-10,2.636L267.6,464h-44.89l-8.442-50.642-10-2.636a159.955,159.955,0,0,1-72.625-41.973l-7.285-7.334L76.241,379.439,53.8,340.562l39.629-32.624-2.7-9.973a160.9,160.9,0,0,1,0-83.93l2.7-9.972L53.8,171.439l22.446-38.878,48.109,18.024,7.285-7.334a159.955,159.955,0,0,1,72.625-41.973l10-2.636L222.706,48H267.6l8.442,50.642,10,2.636a159.955,159.955,0,0,1,72.625,41.973l7.285,7.334,48.109-18.024,22.447,38.877-39.629,32.625,2.7,9.972a160.9,160.9,0,0,1,0,83.93l-2.7,9.973,39.629,32.623Z"></path>
                </svg>
                <span className="text-lg text-white">Administration</span>
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
